# AI Text Watermark Remover

Ein frei verfügbares Open‑Source‑Tool zum Erkennen und Entfernen unsichtbarer Unicode‑Wasserzeichen sowie typischer KI‑Typografie in Texten. 

## 🌟 Was macht dieses Tool?

Viele Texte aus KI‑Modellen enthalten unsichtbare Steuerzeichen oder typografische Eigenheiten, die von Menschen selten verwendet werden. Angreifer können sogar Zero‑Width‑Zeichen nutzen, um Schadcode oder Anweisungen zu verbergen:contentReference[oaicite:0]{index=0}. Dieses Tool:

- findet und markiert unsichtbare Zeichen und bidirektionale Steuerzeichen,
- normalisiert typische KI‑Zeichen wie Em‑Dashes und geschwungene Anführungszeichen zu einfachen ASCII‑Hyphens und -Quotes:contentReference[oaicite:1]{index=1},
- arbeitet komplett im Browser bzw. lokal – dein Text verlässt nie deinen Computer:contentReference[oaicite:2]{index=2}.

## ⚙️ Wie funktioniert es?

1. **Texteingabe**: Du fügst deinen Text in das Eingabefeld oder per CLI/Script ein.
2. **Analyse**: Das Tool scannt den Text nach verdächtigen Unicode‑Zeichen und zeigt sie farblich hervorgehoben an.
3. **Auswahl und Bereinigung**: Du entscheidest, welche Zeichen entfernt oder normalisiert werden sollen.
4. **Export**: Der bereinigte Text kann direkt kopiert oder in Dateien geschrieben werden.

## 🔍 Erkennbare Zeichen

### Unsichtbare Unicode‑Zeichen

- **Zero Width Space** (U+200B)
- **Zero Width Non‑Joiner** (U+200C)
- **Zero Width Joiner** (U+200D)
- **Word Joiner** (U+2060)
- **Narrow No‑Break Space** (U+202F)
- **Non‑Breaking Space** (U+00A0)
- **Zero Width No‑Break Space** (U+FEFF)
- **Bidirektionale Override‑Zeichen** (U+202A–U+202E), die die Textreihenfolge ändern können:contentReference[oaicite:3]{index=3}.

### Typische KI‑Zeichen

Viele LLM‑Modelle verwenden typografische Zeichen, die in normaler Tastatureingabe selten vorkommen:contentReference[oaicite:4]{index=4}. Diese werden automatisch in einfache ASCII‑Entsprechungen umgewandelt:

- **Em Dash** (—) und **En Dash** (–) → `-`
- **Smart Quotes** „“ ‚’ → `"` und `'`
- **Ellipsis** (…) → `...`

## 📦 Installation & Nutzung

- **Web‑App**: Öffne `web/index.html` im Browser, füge Text ein, analysiere ihn und kopiere das Ergebnis.
- **Node.js**: `npm install ai-text-watermark-remover` und dann `const { removeWatermarks } = require('ai-text-watermark-remover');`.
- **Python**: `pip install ai_text_watermark_remover` und `from ai_text_watermark_remover import remove_watermarks`.
- **CLI**: Nutze `cli/clean.js` (Node) oder `cli/clean.py` (Python), um Dateien oder STDIN zu bereinigen.

## 💡 Anwendungsfälle

- Bereinigung von KI‑generierten Texten vor dem Einfügen in E‑Mails, Blogs oder wissenschaftliche Arbeiten.
- Entfernen versteckter Steuerzeichen aus kopierten Texten, z. B. aus PDFs oder Web‑Artikeln.
- Überprüfung von Code oder Konfigurationsdateien auf unsichtbare Zeichen, um Sicherheitsrisiken zu minimieren:contentReference[oaicite:5]{index=5}.

## ⚠️ Hinweis

Obwohl das Tool viele gängige unsichtbare Zeichen und typografische „AI‑Tells“ entfernt, garantiert es keine 100 %‑Erkennung. Einige Wasserzeichen‑Techniken können komplexer sein. Die Nutzung erfolgt auf eigene Verantwortung.

## 📄 Lizenz

Dieses Projekt steht unter der MIT‑Lizenz. Du kannst es frei nutzen, verändern und weiterverbreiten.

---

**Made with ❤️ in Germany**
