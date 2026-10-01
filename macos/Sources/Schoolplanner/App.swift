import SwiftUI
import WebKit
import AppKit

// De map waarin je bestaande web-app (index.html + js/ + css/) staat.
// De macos/-map zit ín het Schoolplanner-project, dus we gaan één map omhoog.
func projectRootURL() -> URL {
    // .../Schoolplanner/macos/Sources/Schoolplanner/App.swift
    let thisFile = URL(fileURLWithPath: #filePath)
    return thisFile
        .deletingLastPathComponent()   // Schoolplanner (Sources dir)
        .deletingLastPathComponent()   // Sources
        .deletingLastPathComponent()   // macos
        .deletingLastPathComponent()   // project root
}

struct PlannerWebView: NSViewRepresentable {
    func makeNSView(context: Context) -> WKWebView {
        let config = WKWebViewConfiguration()

        // Bruggetje: de web-app kan window.webkit.messageHandlers.magister aanroepen.
        let manager = MagisterManager.shared
        config.userContentController.add(manager, name: "magister")

        // Vertel de web-app dat de native koppeling beschikbaar is.
        let bridgeJS = """
        window.__nativeMagister = true;
        window.magisterConnect = function(school){
          window.webkit.messageHandlers.magister.postMessage({ school: school || '' });
        };
        // Laat de web-app weten dat hij in de Mac-app draait (eigen styling:
        // navbar als titelbalk, ruimte voor de stoplicht-knoppen).
        document.documentElement.classList.add('native-mac');
        """
        let script = WKUserScript(source: bridgeJS, injectionTime: .atDocumentStart, forMainFrameOnly: true)
        config.userContentController.addUserScript(script)

        let webView = WKWebView(frame: .zero, configuration: config)
        manager.plannerWebView = webView

        let root = projectRootURL()
        let indexURL = root.appendingPathComponent("index.html")
        // allowingReadAccessTo op de projectmap zodat js/ en css/ ook laden.
        webView.loadFileURL(indexURL, allowingReadAccessTo: root)
        return webView
    }

    func updateNSView(_ nsView: WKWebView, context: Context) {}
}

struct ContentView: View {
    var body: some View {
        PlannerWebView()
            .frame(minWidth: 900, minHeight: 640)
    }
}

// Zorgt dat de app als volwaardige (voorgrond-)app draait, zodat toetsenbord-
// invoer werkt in álle vensters — ook het losse Magister-loginvenster.
final class AppDelegate: NSObject, NSApplicationDelegate {
    func applicationDidFinishLaunching(_ notification: Notification) {
        NSApp.setActivationPolicy(.regular)
        NSApp.activate(ignoringOtherApps: true)
    }
}

@main
struct SchoolplannerApp: App {
    @NSApplicationDelegateAdaptor(AppDelegate.self) var appDelegate

    var body: some Scene {
        WindowGroup("Schoolplanner") {
            ContentView()
        }
        // Geen losse titelbalk: de donkere navbar van de app fungeert als
        // titelbalk, met de stoplicht-knoppen erin (CSS maakt daar ruimte voor).
        .windowStyle(.hiddenTitleBar)
    }
}
