import AppKit
import WebKit

// Regelt de Magister-login en het ophalen van data, en levert het resultaat
// terug aan de planner-webview in exact het formaat dat importMagisterData() verwacht.
final class MagisterManager: NSObject, WKScriptMessageHandler, WKNavigationDelegate, WKUIDelegate {
    static let shared = MagisterManager()

    weak var plannerWebView: WKWebView?

    private var loginWindow: NSWindow?
    private var loginWebView: WKWebView?
    private var pollTimer: Timer?
    private var school: String = ""
    private var navigatedToSchool = false

    // MARK: - Aanroep vanuit de web-app

    func userContentController(_ userContentController: WKUserContentController,
                              didReceive message: WKScriptMessage) {
        guard message.name == "magister" else { return }
        startLogin()
    }

    // MARK: - Loginvenster

    private func startLogin() {
        guard loginWindow == nil else { return }
        navigatedToSchool = false

        let config = WKWebViewConfiguration()
        let web = WKWebView(frame: NSRect(x: 0, y: 0, width: 520, height: 680), configuration: config)
        web.navigationDelegate = self
        web.uiDelegate = self
        loginWebView = web

        let window = NSWindow(
            contentRect: NSRect(x: 0, y: 0, width: 520, height: 680),
            styleMask: [.titled, .closable, .resizable],
            backing: .buffered, defer: false)
        window.title = "Inloggen bij Magister…"
        window.contentView = web
        window.center()
        window.isReleasedWhenClosed = false
        window.initialFirstResponder = web
        NSApp.activate(ignoringOtherApps: true)
        window.makeKeyAndOrderFront(nil)
        window.makeFirstResponder(web)
        loginWindow = window

        // Magisters eigen inlogpagina: hier zoek je zelf je school. Na inloggen kies
        // je je school-omgeving; die openen we ín dit venster (zie createWebViewWith).
        if let url = URL(string: "https://accounts.magister.net/") {
            web.load(URLRequest(url: url))
        }

        // Poll elke seconde of er al een access_token in de sessie staat.
        pollTimer = Timer.scheduledTimer(withTimeInterval: 1.0, repeats: true) { [weak self] _ in
            self?.checkForToken()
        }
    }

    private func closeLogin() {
        pollTimer?.invalidate(); pollTimer = nil
        loginWindow?.close(); loginWindow = nil
        loginWebView = nil
    }

    // Magister opent je school-omgeving vaak in een nieuw tabblad (window.open).
    // We hebben maar één venster, dus laden we die aanvraag hier gewoon zelf.
    func webView(_ webView: WKWebView, createWebViewWith configuration: WKWebViewConfiguration,
                 for navigationAction: WKNavigationAction, windowFeatures: WKWindowFeatures) -> WKWebView? {
        if let url = navigationAction.request.url {
            webView.load(URLRequest(url: url))
        }
        return nil
    }

    // MARK: - Navigatie-diagnostiek (om wit scherm te herkennen)

    func webView(_ webView: WKWebView, didFail navigation: WKNavigation!, withError error: Error) {
        loginWindow?.title = "Laadfout: \(error.localizedDescription)"
    }

    func webView(_ webView: WKWebView, didFailProvisionalNavigation navigation: WKNavigation!, withError error: Error) {
        loginWindow?.title = "Netwerkfout: \(error.localizedDescription)"
    }

    func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
        // Toon in de titel waar we zijn; handig om te zien of de school al bekend is.
        if let host = webView.url?.host { loginWindow?.title = host }
    }

    // Leidt de schoolnaam af uit de host waarop je uiteindelijk ingelogd bent
    // (bijv. hetnieuwelyceum.magister.net -> "hetnieuwelyceum").
    private func schoolFromCurrentURL() -> String? {
        guard let host = loginWebView?.url?.host, host.hasSuffix(".magister.net") else { return nil }
        let sub = host.replacingOccurrences(of: ".magister.net", with: "")
        if sub.isEmpty || sub == "accounts" || sub == "www" || sub == "login" { return nil }
        return sub
    }

    // Zoekt in localStorage/sessionStorage naar het OIDC-access_token en levert
    // tegelijk diagnostiek (de sleutelnamen) zodat we het kunnen opsporen.
    private func checkForToken() {
        // Verzamel host, een eventueel token, én alle school-adressen die op de
        // pagina staan (de carrousel-kaartjes linken naar de echte school-omgeving).
        let js = """
        (function(){
          function looksLikeJWT(x){ return typeof x==='string' && x.indexOf('eyJ')===0 && x.split('.').length===3; }
          var token=null;
          function consider(v){
            if(!v) return;
            if(v.indexOf('access_token')>=0){
              try{ var p=JSON.parse(v); if(p && p.access_token && !token) token=p.access_token; }catch(e){}
            }
            if(!token && looksLikeJWT(v)) token=v;
          }
          function scan(st){ for(var i=0;i<st.length;i++) consider(st.getItem(st.key(i))); }
          scan(sessionStorage); scan(localStorage);
          // Zoek in de hele pagina naar https://<school>.magister.net adressen.
          var found={}, re=/https?:\\/\\/([a-z0-9-]+)\\.magister\\.net/gi, m;
          var hay=document.documentElement.innerHTML;
          var as=document.getElementsByTagName('a');
          for(var i=0;i<as.length;i++){ if(as[i].href) hay+=' '+as[i].href; }
          while((m=re.exec(hay))!==null){
            var sub=m[1].toLowerCase();
            if(sub!=='accounts'&&sub!=='www'&&sub!=='login') found[sub]=true;
          }
          return JSON.stringify({ token: token, host: location.host, found: Object.keys(found) });
        })();
        """
        loginWebView?.evaluateJavaScript(js) { [weak self] result, _ in
            guard let self = self,
                  let raw = result as? String,
                  let data = raw.data(using: .utf8),
                  let obj = try? JSONSerialization.jsonObject(with: data) as? [String: Any] else { return }

            let host = (obj["host"] as? String) ?? "?"
            let token = obj["token"] as? String
            let found = (obj["found"] as? [String]) ?? []

            // Diagnose wegschrijven zodat we bij problemen zien wat er gevonden is.
            let dump = URL(fileURLWithPath: "/tmp/magister_debug.json")
            if let pretty = try? JSONSerialization.data(withJSONObject: obj, options: .prettyPrinted) {
                try? pretty.write(to: dump)
            }

            // Al op de school-omgeving met een token? Dan zijn we klaar.
            if let token = token, !token.isEmpty, let s = self.schoolFromCurrentURL() {
                self.loginWindow?.title = "Gelukt! Gegevens ophalen…"
                self.school = s
                self.closeLogin()
                self.fetchData(token: token)
                return
            }

            // Ingelogd op accounts en het echte school-adres staat op de pagina?
            // Stuur de app daar zelf naartoe (silent SSO, geen nieuwe login nodig).
            if !self.navigatedToSchool, host == "accounts.magister.net", let sub = found.first {
                self.navigatedToSchool = true
                self.loginWindow?.title = "Naar je school-omgeving…"
                if let url = URL(string: "https://\(sub).magister.net/") {
                    self.loginWebView?.load(URLRequest(url: url))
                }
            }
        }
    }

    // MARK: - Data ophalen (native, dus geen CORS-muur)

    private func fetchData(token: String) {
        let base = "https://\(school).magister.net"
        // 1) Account → persoon-id ophalen.
        get("\(base)/api/account", token: token) { [weak self] account in
            guard let self = self else { return }
            let persoonId = ((account?["Persoon"] as? [String: Any])?["Id"] as? Int) ?? 0
            let naam = (account?["Persoon"] as? [String: Any])?["Roepnaam"] as? String

            let group = DispatchGroup()
            var cijfers: [String: Any] = ["items": []]
            var afspraken: [String: Any] = ["Items": []]

            // 2) Cijfers.
            group.enter()
            self.get("\(base)/api/personen/\(persoonId)/cijfers/laatste", token: token) { res in
                if let res = res { cijfers = res }
                group.leave()
            }

            // 3) Afspraken (rooster) van vandaag t/m 7 dagen.
            let fmt = DateFormatter(); fmt.dateFormat = "yyyy-MM-dd"
            let van = fmt.string(from: Date())
            let tot = fmt.string(from: Date().addingTimeInterval(7*24*3600))
            group.enter()
            self.get("\(base)/api/personen/\(persoonId)/afspraken?van=\(van)&tot=\(tot)", token: token) { res in
                if let res = res { afspraken = res }
                group.leave()
            }

            group.notify(queue: .main) {
                let payload: [String: Any] = [
                    "account": ["naam": naam ?? ""],
                    "cijfers": cijfers,
                    "afspraken": afspraken,
                ]
                self.deliver(payload)
            }
        }
    }

    private func get(_ urlString: String, token: String, done: @escaping ([String: Any]?) -> Void) {
        guard let url = URL(string: urlString) else { done(nil); return }
        var req = URLRequest(url: url)
        req.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        req.setValue("application/json", forHTTPHeaderField: "Accept")
        URLSession.shared.dataTask(with: req) { data, _, _ in
            guard let data = data,
                  let obj = try? JSONSerialization.jsonObject(with: data) as? [String: Any] else {
                done(nil); return
            }
            done(obj)
        }.resume()
    }

    // MARK: - Teruggeven aan de planner

    private func deliver(_ payload: [String: Any]) {
        guard let web = plannerWebView,
              let data = try? JSONSerialization.data(withJSONObject: payload),
              let json = String(data: data, encoding: .utf8) else { return }
        // importMagisterData + verbinding markeren + pagina verversen, in de web-app.
        let js = """
        (function(){
          try {
            var d = \(json);
            var r = importMagisterData(d);
            saveMagisterConnection(true, { school: '\(school)', user: d.account && d.account.naam });
            if (typeof renderPage === 'function' && typeof currentPage !== 'undefined') renderPage(currentPage);
            alert('\\u2713 Magister bijgewerkt!\\n' + r.importedGrades + ' cijfers en ' + r.importedLessons + ' lessen ge\\u00efmporteerd.');
          } catch(e){ alert('Verwerken mislukt: ' + e); }
        })();
        """
        web.evaluateJavaScript(js)
    }
}
