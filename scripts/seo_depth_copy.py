"""Added sections for /accuracy and /standards.

Same facts in every language. Figures are the published reference values
(WHO Environmental Noise Guidelines for the European Region, 2018;
OSHA 29 CFR 1910.95; NIOSH criteria; IEC 61672-1 class acceptance at 1 kHz;
GB 3096-2008 functional-area day/night limits). They are context, not a
claim that a phone measurement meets those methods.
"""

from __future__ import annotations


def _section(section_id: str, eyebrow: str, title: str, lead: str, cards: list[tuple[str, str]], second_title: str, items: list[str], note: str) -> str:
    card_html = []
    for heading, body in cards:
        card_html.append(
            "      <div class=\"card reveal\">\n"
            f"        <h3>{heading}</h3>\n"
            f"        <p>{body}</p>\n"
            "      </div>"
        )
    lis = "\n".join(f"          <li>{item}</li>" for item in items)
    cards_joined = "\n".join(card_html)
    return (
        f'<section class="section" id="{section_id}">\n'
        '  <div class="section-header" style="margin-bottom: 1.25rem;">\n'
        f'    <span class="eyebrow">{eyebrow}</span>\n'
        f'    <h2>{title}</h2>\n'
        f'    <p class="muted">{lead}</p>\n'
        "  </div>\n"
        '  <div class="grid">\n'
        f"{cards_joined}\n"
        "  </div>\n"
        '  <div class="card reveal" style="margin-top: 1.25rem;">\n'
        f"    <h2>{second_title}</h2>\n"
        '    <ul class="check-list">\n'
        f"{lis}\n"
        "    </ul>\n"
        f'    <p class="muted" style="margin-top: 12px;">{note}</p>\n'
        "  </div>\n"
        "</section>\n"
    )


def accuracy_html(lang: str) -> str:
    t = ACCURACY[lang]
    return _section("measurement-method", t["eyebrow"], t["title"], t["lead"], t["cards"], t["second"], t["items"], t["note"])


def standards_html(lang: str) -> str:
    t = STANDARDS[lang]
    return _section("how-to-read-limits", t["eyebrow"], t["title"], t["lead"], t["cards"], t["second"], t["items"], t["note"])


ACCURACY = {
    "en": {
        "eyebrow": "What the number means",
        "title": "How a browser meter estimates decibels, and what it cannot certify",
        "lead": "SOUNDTEST.PRO reads the microphone through the Web Audio API, applies digital A, C, or Z weighting modeled on IEC 61672-1, and adds a stored device offset. The result is a field estimate for a timeline. It is not a calibrated sound level meter reading.",
        "cards": [
            ("Signal path", "The browser does not receive the raw capsule voltage. The operating system and the browser may still apply gain, automatic gain control, noise suppression, or echo cancellation unless those constraints are turned off. A case, a finger, wind, or a phone lying face-down changes the level before any filter runs. Two phones in the same room can disagree by more than the on-screen tolerance even when both copies of the tool are working as designed."),
            ("Where ±1 to 5 dB applies", "The device profiles shipped with the product were aligned against a reference sound level meter and a 94 dB acoustic calibrator on common phones. That stated band is for speech-range sound, a clear microphone opening, and a profile that matches the device. Bass through a wall, a siren above the speech band, a covered microphone, or an unknown laptop can fall outside it. A larger gap is a reason to store a calibration offset, not a reason to average two phones and call the result official."),
            ("What the SHA-256 line proves", "The manifest hash is computed over the exported file bytes. If someone edits the CSV or the PDF, the hash no longer matches. The hash does not prove the microphone was accurate, the GPS fix was the right building, or the note describes the event. A poorly aimed but unedited recording still hashes. File integrity and acoustic truth are different claims, and the export only supports the first."),
            ("Phone record and a Class 1 or Class 2 meter", "A Class 1 or Class 2 meter under IEC 61672-1 is checked as a whole instrument. At the 1 kHz reference point the acceptance interval is about ±1.1 dB for Class 1 and ±1.4 dB for Class 2, and it widens across frequency, direction, and temperature. Copying the A-weighting curve in software does not put a phone into either class. Use the phone record to show when, where, and roughly how loud an event was, with audio and notes. Use a certified meter, run by the method the rule names, when a fine, a lease penalty, or an enforcement file depends on the number itself."),
        ],
        "second": "Keep one session comparable with the next",
        "items": [
            "Same phone, same case, same weighting, and the same Fast or Slow response.",
            "Microphone about 1.2–1.5 m off the floor, not in a pocket and not against a wall.",
            "Write down windows, other sources, and the distance if you know it. A peak with no duration is hard to compare with LAeq or with an 8-hour dose.",
            "If the number will be shown next to a limit, set the offset from a calibrator or from a meter you trust, and keep that offset inside the export.",
            "Save the audio, the CSV, the PDF, and the manifest together. The hash only covers the files you actually hash.",
        ],
        "note": 'Read the limit figures on the <a class="in-content-link" href="{{standards}}">standards page</a> before comparing a take with WHO, OSHA, or a local rule, and keep the raw files with the <a class="in-content-link" href="{{samples}}">sample dossier layout</a>. Open the <a class="in-content-link" href="{{meter}}">recorder</a> when the notes are ready. The recorder does not decide compliance.',
    },
    "zh": {
        "eyebrow": "读数到底代表什么",
        "title": "浏览器声级估计如何得出，以及它不能出具的结论",
        "lead": "SOUNDTEST.PRO 通过 Web Audio API 读取麦克风，套用按 IEC 61672-1 建模的 A/C/Z 数字计权，再加上已保存的设备偏移。结果是一条时间线上的现场估计，不是经检定声级计的读数。",
        "cards": [
            ("信号经过了什么", "浏览器拿不到传声器膜片上的原始电压。操作系统和浏览器仍可能加上增益、自动增益、降噪或回声消除，除非这些约束被关掉。手机壳、手指、风，或把手机扣在桌面上，都会在滤波之前改变电平。同一房间里的两部手机，即使工具都在正常工作，读数差也可以大于屏幕上标出的容差。"),
            ("±1 到 5 dB 用在什么条件下", "随产品提供的设备档案，是在常见手机上对照参考声级计和 94 dB 声学校准器对齐过的。这个区间针对的是语音频段、进声口未被挡住、并且档案与这台设备相符的情况。隔墙低频、语音频段以上的警报声、被盖住的麦克风，或一台没有档案的笔记本电脑，都可以落在区间外面。差距变大时，应当保存校准偏移，而不是把两部手机取平均后当成正式结果。"),
            ("SHA-256 那一行证明什么", "清单里的哈希是对导出文件字节计算的。有人改了 CSV 或 PDF，哈希就不再相符。它不能证明麦克风准、GPS 定位到了那栋楼，或备注写的就是当时的事件。对着错误方向、但文件没有被改过的录音，哈希仍然成立。文件完整和声学事实是两件不同的事，导出差只支持前一件。"),
            ("手机记录和 1 级 / 2 级声级计", "IEC 61672-1 下的 1 级或 2 级声级计，是把整台仪器放在一起检定的。在 1 kHz 参考点，接收区间大约是 1 级 ±1.1 dB、2 级 ±1.4 dB，换到其他频率、方向和温度还会放宽。在软件里复现 A 计权曲线，并不会让手机变成其中任何一级。手机记录用来说明事件发生的时间、地点和大致响度，并带上音频和备注。罚款、合同违约金或执法卷宗若取决于这个数字本身，应按该规则写明的方法使用经检定的声级计。"),
        ],
        "second": "让这一次记录能和上一次对照",
        "items": [
            "同一部手机、同一个保护壳、同一种计权，以及同样的 Fast 或 Slow 时间计权。",
            "麦克风离地面约 1.2–1.5 米，不要放在口袋里，也不要贴着墙。",
            "写下门窗、其他声源，以及你知道的距离。没有时长的峰值很难和 LAeq 或 8 小时剂量比较。",
            "如果读数会和某个限值并排放，先用校准器或你信任的声级计设定偏移，并把偏移留在导出文件里。",
            "音频、CSV、PDF 和清单一起保存。哈希只覆盖你实际计算过的那些文件。",
        ],
        "note": '拿一次记录去对照 WHO、OSHA 或当地规则之前，先看<a class="in-content-link" href="{{standards}}">标准页</a>里的限值说明，并按<a class="in-content-link" href="{{samples}}">报告样例</a>把原始文件留全。备注写好后再打开<a class="in-content-link" href="{{meter}}">记录工具</a>。记录工具不判断是否达标。',
    },
    "es": {
        "eyebrow": "Qué significa el número",
        "title": "Cómo estima los decibelios un medidor del navegador, y qué no puede certificar",
        "lead": "SOUNDTEST.PRO lee el micrófono con la Web Audio API, aplica ponderación digital A, C o Z modelada según IEC 61672-1 y suma un desplazamiento guardado del dispositivo. El resultado es una estimación de campo para una línea de tiempo. No es la lectura de un sonómetro calibrado.",
        "cards": [
            ("Recorrido de la señal", "El navegador no recibe el voltaje bruto de la cápsula. El sistema y el navegador aún pueden aplicar ganancia, control automático de ganancia, supresión de ruido o cancelación de eco, salvo que esas restricciones estén desactivadas. Una funda, un dedo, el viento o el teléfono boca abajo cambian el nivel antes de cualquier filtro. Dos teléfonos en la misma habitación pueden diferir más que la tolerancia en pantalla aunque las dos copias de la herramienta funcionen como están diseñadas."),
            ("Dónde aplica ±1 a 5 dB", "Los perfiles de dispositivo incluidos se alinearon con un sonómetro de referencia y un calibrador acústico de 94 dB en teléfonos habituales. Esa banda corresponde a sonido en la gama de la voz, una abertura de micrófono libre y un perfil que coincide con el aparato. Los graves a través de una pared, una sirena por encima de la banda de voz, un micrófono tapado o un portátil desconocido pueden quedar fuera. Una diferencia mayor es motivo para guardar un desplazamiento de calibración, no para promediar dos teléfonos y llamar oficial al resultado."),
            ("Qué demuestra la línea SHA-256", "El hash del manifiesto se calcula sobre los bytes del archivo exportado. Si alguien edita el CSV o el PDF, el hash deja de coincidir. No demuestra que el micrófono fuera exacto, que el GPS señalara el edificio correcto ni que la nota describa el suceso. Una grabación mal orientada pero sin editar sigue teniendo hash. La integridad del archivo y la verdad acústica son afirmaciones distintas, y la exportación solo sostiene la primera."),
            ("Registro del teléfono y sonómetro de clase 1 o 2", "Un sonómetro de clase 1 o clase 2 según IEC 61672-1 se comprueba como instrumento completo. En el punto de referencia de 1 kHz el intervalo de aceptación es de unos ±1,1 dB en clase 1 y ±1,4 dB en clase 2, y se amplía con la frecuencia, la dirección y la temperatura. Copiar la curva de ponderación A en software no mete un teléfono en ninguna de las dos clases. Use el registro del teléfono para mostrar cuándo, dónde y de forma aproximada cuán fuerte fue un suceso, con audio y notas. Use un sonómetro certificado, con el método que nombre la norma, cuando una multa, una penalización del contrato o un expediente dependan del número en sí."),
        ],
        "second": "Hacer que una sesión se pueda comparar con la siguiente",
        "items": [
            "El mismo teléfono, la misma funda, la misma ponderación y la misma respuesta Fast o Slow.",
            "Micrófono a unos 1,2–1,5 m del suelo, ni en un bolsillo ni contra una pared.",
            "Anote ventanas, otras fuentes y la distancia si la conoce. Un pico sin duración es difícil de comparar con LAeq o con una dosis de 8 horas.",
            "Si el número va a mostrarse junto a un límite, fije el desplazamiento con un calibrador o con un medidor de confianza y consérvelo dentro de la exportación.",
            "Guarde juntos el audio, el CSV, el PDF y el manifiesto. El hash solo cubre los archivos que realmente hashea.",
        ],
        "note": 'Lea las cifras de la <a class="in-content-link" href="{{standards}}">página de normas</a> antes de comparar una toma con la OMS, OSHA o una regla local, y conserve los archivos brutos con el <a class="in-content-link" href="{{samples}}">modelo de expediente</a>. Abra la <a class="in-content-link" href="{{meter}}">grabadora</a> cuando las notas estén listas. La grabadora no decide el cumplimiento.',
    },
    "fr": {
        "eyebrow": "Ce que le chiffre veut dire",
        "title": "Comment un sonomètre de navigateur estime les décibels, et ce qu’il ne peut pas certifier",
        "lead": "SOUNDTEST.PRO lit le microphone via l’API Web Audio, applique une pondération numérique A, C ou Z calquée sur l’IEC 61672-1, puis ajoute un décalage d’appareil enregistré. Le résultat est une estimation de terrain pour une chronologie. Ce n’est pas la lecture d’un sonomètre étalonné.",
        "cards": [
            ("Chemin du signal", "Le navigateur ne reçoit pas la tension brute de la capsule. Le système et le navigateur peuvent encore appliquer un gain, un contrôle automatique de gain, une suppression de bruit ou une annulation d’écho, tant que ces contraintes ne sont pas coupées. Une coque, un doigt, le vent ou un téléphone posé face contre table changent le niveau avant tout filtre. Deux téléphones dans la même pièce peuvent diverger de plus que la tolérance affichée, même si les deux copies de l’outil fonctionnent comme prévu."),
            ("Où s’applique ±1 à 5 dB", "Les profils livrés avec le produit ont été alignés sur un sonomètre de référence et un calibreur acoustique de 94 dB, sur des téléphones courants. Cette plage vise un son dans la bande de la parole, une ouverture de microphone dégagée et un profil qui correspond à l’appareil. Des basses à travers un mur, une sirène au-dessus de la bande vocale, un microphone couvert ou un ordinateur portable inconnu peuvent sortir de cette plage. Un écart plus grand est une raison d’enregistrer un décalage d’étalonnage, pas de moyenner deux téléphones et d’appeler le résultat officiel."),
            ("Ce que prouve la ligne SHA-256", "Le hachage du manifeste est calculé sur les octets du fichier exporté. Si quelqu’un modifie le CSV ou le PDF, le hachage ne correspond plus. Il ne prouve pas que le microphone était juste, que le GPS visait le bon bâtiment, ni que la note décrit l’événement. Un enregistrement mal orienté mais non modifié a toujours un hachage valide. L’intégrité du fichier et la vérité acoustique sont deux affirmations différentes, et l’export ne soutient que la première."),
            ("Relevé de téléphone et sonomètre de classe 1 ou 2", "Un sonomètre de classe 1 ou 2 selon l’IEC 61672-1 est vérifié comme instrument complet. Au point de référence de 1 kHz, l’intervalle d’acceptation est d’environ ±1,1 dB en classe 1 et ±1,4 dB en classe 2, et il s’élargit avec la fréquence, la direction et la température. Reproduire la courbe de pondération A dans un logiciel ne place pas un téléphone dans l’une ou l’autre classe. Utilisez le relevé du téléphone pour montrer quand, où et à peu près à quel niveau un événement s’est produit, avec l’audio et les notes. Utilisez un sonomètre certifié, selon la méthode nommée par la règle, lorsqu’une amende, une pénalité de bail ou un dossier d’exécution dépend du chiffre lui-même."),
        ],
        "second": "Rendre une session comparable à la suivante",
        "items": [
            "Le même téléphone, la même coque, la même pondération, et la même réponse Fast ou Slow.",
            "Microphone à environ 1,2–1,5 m du sol, ni dans une poche ni contre un mur.",
            "Notez les fenêtres, les autres sources et la distance si vous la connaissez. Une crête sans durée se compare mal à un LAeq ou à une dose de 8 heures.",
            "Si le nombre sera montré à côté d’une limite, réglez le décalage avec un calibreur ou un sonomètre de confiance, et conservez ce décalage dans l’export.",
            "Enregistrez ensemble l’audio, le CSV, le PDF et le manifeste. Le hachage ne couvre que les fichiers réellement hachés.",
        ],
        "note": 'Lisez les valeurs de la <a class="in-content-link" href="{{standards}}">page des normes</a> avant de comparer une prise à l’OMS, à l’OSHA ou à une règle locale, et conservez les fichiers bruts avec le <a class="in-content-link" href="{{samples}}">modèle de dossier</a>. Ouvrez l’<a class="in-content-link" href="{{meter}}">enregistreur</a> quand les notes sont prêtes. L’enregistreur ne tranche pas la conformité.',
    },
    "de": {
        "eyebrow": "Was die Zahl bedeutet",
        "title": "Wie ein Browser-Messgerät Dezibel schätzt und was es nicht bescheinigen kann",
        "lead": "SOUNDTEST.PRO liest das Mikrofon über die Web Audio API, wendet eine an IEC 61672-1 angelehnte digitale A-, C- oder Z-Bewertung an und addiert einen gespeicherten Geräteoffset. Das Ergebnis ist eine Feldschätzung für einen Zeitverlauf. Es ist kein kalibrierter Schallpegelmesser-Wert.",
        "cards": [
            ("Signalweg", "Der Browser erhält nicht die rohe Kapselspannung. Betriebssystem und Browser können weiterhin Verstärkung, automatische Verstärkungsregelung, Rauschunterdrückung oder Echounterdrückung anwenden, solange diese Vorgaben nicht ausgeschaltet sind. Hülle, Finger, Wind oder ein mit dem Display nach unten liegendes Telefon ändern den Pegel, bevor irgendein Filter läuft. Zwei Telefone im selben Raum können stärker voneinander abweichen als die angezeigte Toleranz, auch wenn beide Kopien des Werkzeugs wie vorgesehen arbeiten."),
            ("Wo ±1 bis 5 dB gilt", "Die mitgelieferten Geräteprofile wurden an einem Referenz-Schallpegelmesser und einem akustischen Kalibrator von 94 dB auf gängigen Telefonen ausgerichtet. Diese Spanne gilt für Schall im Sprachbereich, eine freie Mikrofonöffnung und ein Profil, das zum Gerät passt. Bass durch eine Wand, eine Sirene oberhalb des Sprachbandes, ein verdecktes Mikrofon oder ein unbekanntes Notebook können außerhalb liegen. Eine größere Lücke ist ein Grund, einen Kalibrieroffset zu speichern, kein Grund, zwei Telefone zu mitteln und das Ergebnis für amtlich zu erklären."),
            ("Was die SHA-256-Zeile belegt", "Der Manifest-Hash wird über die Bytes der exportierten Datei berechnet. Ändert jemand CSV oder PDF, passt der Hash nicht mehr. Er belegt nicht, dass das Mikrofon genau war, dass die GPS-Position das richtige Gebäude traf oder dass die Notiz das Ereignis beschreibt. Eine schlecht ausgerichtete, aber unbearbeitete Aufnahme hat weiterhin einen gültigen Hash. Dateiintegrität und akustische Wahrheit sind verschiedene Aussagen, und der Export stützt nur die erste."),
            ("Telefonprotokoll und Messgerät der Klasse 1 oder 2", "Ein Messgerät der Klasse 1 oder 2 nach IEC 61672-1 wird als ganzes Instrument geprüft. Am 1-kHz-Referenzpunkt liegt das Annahmeintervall bei etwa ±1,1 dB für Klasse 1 und ±1,4 dB für Klasse 2 und wird über Frequenz, Richtung und Temperatur breiter. Die A-Bewertungskurve in Software nachzubilden setzt ein Telefon in keine der beiden Klassen. Nutzen Sie das Telefonprotokoll, um zu zeigen, wann, wo und ungefähr wie laut ein Ereignis war, mit Audio und Notizen. Nutzen Sie ein geeichtes Messgerät nach dem Verfahren, das die Vorschrift nennt, wenn ein Bußgeld, eine Vertragsstrafe oder eine Vollzugsakte von der Zahl selbst abhängt."),
        ],
        "second": "Eine Sitzung mit der nächsten vergleichbar halten",
        "items": [
            "Dasselbe Telefon, dieselbe Hülle, dieselbe Bewertung und dieselbe Fast- oder Slow-Zeitbewertung.",
            "Mikrofon etwa 1,2–1,5 m über dem Boden, nicht in der Tasche und nicht an der Wand.",
            "Notieren Sie Fenster, andere Quellen und die Entfernung, wenn Sie sie kennen. Eine Spitze ohne Dauer lässt sich schlecht mit LAeq oder einer 8-Stunden-Dosis vergleichen.",
            "Soll die Zahl neben einem Grenzwert stehen, setzen Sie den Offset mit einem Kalibrator oder einem Messgerät, dem Sie vertrauen, und behalten Sie den Offset im Export.",
            "Speichern Sie Audio, CSV, PDF und Manifest zusammen. Der Hash deckt nur die Dateien ab, die Sie tatsächlich hashen.",
        ],
        "note": 'Lesen Sie die Grenzwerte auf der <a class="in-content-link" href="{{standards}}">Normenseite</a>, bevor Sie eine Aufnahme mit WHO, OSHA oder einer örtlichen Regel vergleichen, und bewahren Sie die Rohdateien beim <a class="in-content-link" href="{{samples}}">Musterdossier</a> auf. Öffnen Sie den <a class="in-content-link" href="{{meter}}">Recorder</a>, wenn die Notizen stehen. Der Recorder entscheidet nicht über Einhaltung.',
    },
    "ja": {
        "eyebrow": "数値の意味",
        "title": "ブラウザの騒音計がデシベルを推定する仕組みと、証明できないこと",
        "lead": "SOUNDTEST.PRO は Web Audio API でマイクを読み、IEC 61672-1 を模したデジタルの A/C/Z 特性をかけ、保存済みの端末オフセットを足します。結果は時系列のための現場推定値です。校正された騒音計の指示値ではありません。",
        "cards": [
            ("信号の通り道", "ブラウザは振動板の生の電圧を受け取りません。OS とブラウザは、制約を切らない限り、ゲイン、自動ゲイン、ノイズ抑制、エコーキャンセルをまだかけることがあります。ケース、指、風、画面を下にした置き方は、フィルタの前にレベルを変えます。同じ部屋の 2 台の電話は、ツールがどちらも設計どおり動いていても、画面の許容差より大きくずれることがあります。"),
            ("±1〜5 dB が当てはまる条件", "製品に入っている端末プロファイルは、一般的な電話で基準騒音計と 94 dB の音響校正器に合わせたものです。この幅は、音声帯域の音、塞がれていないマイク開口、その端末に合うプロファイルが前提です。壁越しの低音、音声帯域より上のサイレン、覆われたマイク、プロファイルのないノート PC は外に出ることがあります。差が大きいときは校正オフセットを保存する理由であり、2 台を平均して公式値と呼ぶ理由ではありません。"),
            ("SHA-256 の行が証明すること", "マニフェストのハッシュは、書き出したファイルのバイト列に対して計算します。CSV や PDF を書き換えるとハッシュは一致しません。マイクが正確だったこと、GPS が正しい建物を指したこと、メモが出来事を書いていることは証明しません。向きが悪くても改変されていない録音には、ハッシュが付いたままです。ファイルの完全性と音の事実は別の主張で、書き出しが支えるのは前者だけです。"),
            ("電話の記録とクラス 1 / クラス 2 の騒音計", "IEC 61672-1 のクラス 1 またはクラス 2 の騒音計は、機器全体として検査されます。1 kHz の基準点での許容区間は、クラス 1 で約 ±1.1 dB、クラス 2 で約 ±1.4 dB で、周波数、方向、温度が変わると広がります。ソフトで A 特性の曲線を写しても、電話はどちらのクラスにも入りません。電話の記録は、いつ、どこで、おおよそどれくらい大きかったかを、音声とメモ付きで示すために使います。罰金、契約上の違約、行政の記録がその数値そのものに依存するときは、規則が指定する方法で検定済みの騒音計を使います。"),
        ],
        "second": "次の測定と比べられるようにする",
        "items": [
            "同じ電話、同じケース、同じ周波数重み付け、同じ Fast または Slow。",
            "マイクは床から約 1.2〜1.5 m。ポケットの中や壁に付けない。",
            "窓、ほかの音源、分かるなら距離を書く。時間の長さがないピークは LAeq や 8 時間暴露と比べにくい。",
            "数値を限度値と並べるなら、校正器か信頼できる騒音計でオフセットを決め、書き出しに残す。",
            "音声、CSV、PDF、マニフェストを一緒に保存する。ハッシュが覆うのは、実際にハッシュしたファイルだけです。",
        ],
        "note": 'WHO、OSHA、地域の規則と突き合わせる前に<a class="in-content-link" href="{{standards}}">基準のページ</a>の数値を読み、<a class="in-content-link" href="{{samples}}">報告書の見本</a>と同じように元ファイルを残してください。メモが揃ってから<a class="in-content-link" href="{{meter}}">記録ツール</a>を開きます。記録ツールは適合を判断しません。',
    },
    "ko": {
        "eyebrow": "숫자가 뜻하는 것",
        "title": "브라우저 소음계가 데시벨을 추정하는 방식과 증명하지 못하는 것",
        "lead": "SOUNDTEST.PRO 는 Web Audio API 로 마이크를 읽고, IEC 61672-1 을 본뜬 디지털 A/C/Z 가중을 적용한 뒤 저장된 기기 오프셋을 더합니다. 결과는 시간 기록을 위한 현장 추정값입니다. 교정된 소음계의 지시값이 아닙니다.",
        "cards": [
            ("신호가 거치는 경로", "브라우저는 진동판의 원시 전압을 받지 않습니다. 운영체제와 브라우저는 그 제약을 끄지 않는 한 이득, 자동 이득, 잡음 억제, 에코 제거를 여전히 적용할 수 있습니다. 케이스, 손가락, 바람, 화면을 아래로 둔 배치는 필터보다 먼저 레벨을 바꿉니다. 같은 방의 두 전화는 도구가 둘 다 설계대로 동작해도 화면의 허용차보다 크게 다를 수 있습니다."),
            ("±1~5 dB 가 적용되는 조건", "제품에 들어 있는 기기 프로필은 흔한 전화에서 기준 소음계와 94 dB 음향 교정기로 맞춰 둔 것입니다. 이 구간은 음성 대역의 소리, 막히지 않은 마이크 입구, 그 기기에 맞는 프로필을 전제로 합니다. 벽을 통과한 저음, 음성 대역 위의 사이렌, 가려진 마이크, 프로필이 없는 노트북은 밖으로 벗어날 수 있습니다. 차이가 커지면 교정 오프셋을 저장할 이유이지, 두 전화를 평균해 공식 값이라 부를 이유는 아닙니다."),
            ("SHA-256 줄이 증명하는 것", "매니페스트 해시는 내보낸 파일의 바이트에 대해 계산합니다. CSV 나 PDF 를 고치면 해시는 더 이상 맞지 않습니다. 마이크가 정확했는지, GPS 가 맞는 건물을 가리켰는지, 메모가 그 사건을 적었는지는 증명하지 않습니다. 방향은 나쁘지만 고쳐지지 않은 녹음에도 해시는 남습니다. 파일 무결성과 소리의 사실은 다른 주장이며, 내보내기는 앞의 것만 뒷받침합니다."),
            ("전화 기록과 1급 / 2급 소음계", "IEC 61672-1 의 1급 또는 2급 소음계는 기기 전체로 검사합니다. 1 kHz 기준점의 허용 구간은 1급 약 ±1.1 dB, 2급 약 ±1.4 dB 이고, 주파수, 방향, 온도에 따라 넓어집니다. 소프트웨어에서 A 가중 곡선을 베끼더라도 전화는 어느 등급에도 들어가지 않습니다. 전화 기록은 사건이 언제, 어디서, 대략 얼마나 컸는지를 오디오와 메모와 함께 보이는 데 씁니다. 과태료, 계약상 제재, 행정 기록이 그 숫자 자체에 달려 있으면, 규칙이 정한 방법으로 검정된 소음계를 사용합니다."),
        ],
        "second": "다음 기록과 비교할 수 있게 두기",
        "items": [
            "같은 전화, 같은 케이스, 같은 가중, 같은 Fast 또는 Slow.",
            "마이크는 바닥에서 약 1.2–1.5 m. 주머니 안이나 벽에 붙이지 않습니다.",
            "창문, 다른 음원, 알고 있다면 거리를 적습니다. 길이가 없는 피크는 LAeq 나 8시간 노출과 비교하기 어렵습니다.",
            "숫자를 한계값 옆에 놓을 거라면 교정기나 신뢰하는 소음계로 오프셋을 정하고, 내보내기에 남깁니다.",
            "오디오, CSV, PDF, 매니페스트를 함께 저장합니다. 해시는 실제로 해시한 파일만 덮습니다.",
        ],
        "note": 'WHO, OSHA 또는 지역 규칙과 비교하기 전에 <a class="in-content-link" href="{{standards}}">기준 페이지</a>의 수치를 읽고, <a class="in-content-link" href="{{samples}}">보고서 예시</a>처럼 원본 파일을 남기세요. 메모가 준비된 뒤에 <a class="in-content-link" href="{{meter}}">기록 도구</a>를 엽니다. 기록 도구는 적합 여부를 판단하지 않습니다.',
    },
    "vi": {
        "eyebrow": "Con số có nghĩa gì",
        "title": "Máy đo trên trình duyệt ước lượng decibel thế nào, và điều nó không chứng nhận được",
        "lead": "SOUNDTEST.PRO đọc micro qua Web Audio API, áp trọng số số A, C hoặc Z mô phỏng IEC 61672-1, rồi cộng độ lệch thiết bị đã lưu. Kết quả là ước lượng tại hiện trường cho một dòng thời gian. Đó không phải số đọc của máy đo mức âm đã hiệu chuẩn.",
        "cards": [
            ("Đường đi của tín hiệu", "Trình duyệt không nhận điện áp thô của màng micro. Hệ điều hành và trình duyệt vẫn có thể áp khuếch đại, tự động khuếch đại, khử ồn hoặc khử vọng, trừ khi các ràng buộc đó bị tắt. Ốp lưng, ngón tay, gió, hoặc điện thoại úp mặt xuống đổi mức trước khi bộ lọc chạy. Hai điện thoại trong cùng một phòng có thể lệch hơn dung sai trên màn hình dù cả hai bản công cụ đều chạy đúng thiết kế."),
            ("±1 đến 5 dB áp dụng khi nào", "Hồ sơ thiết bị đi kèm sản phẩm được căn theo máy đo mức âm tham chiếu và bộ hiệu chuẩn âm 94 dB trên các điện thoại phổ biến. Dải này dành cho âm trong băng tiếng nói, lỗ micro không bị che, và hồ sơ khớp với máy. Tiếng trầm xuyên tường, còi trên băng tiếng nói, micro bị che, hoặc máy tính xách tay chưa có hồ sơ có thể nằm ngoài dải. Khoảng cách lớn hơn là lý do lưu độ lệch hiệu chuẩn, không phải lý do lấy trung bình hai điện thoại rồi gọi đó là số chính thức."),
            ("Dòng SHA-256 chứng minh điều gì", "Hàm băm của bản kê được tính trên byte của tệp đã xuất. Nếu ai đó sửa CSV hoặc PDF, hàm băm không còn khớp. Nó không chứng minh micro chính xác, GPS trúng đúng tòa nhà, hay ghi chú mô tả đúng sự việc. Bản ghi hướng xấu nhưng không bị sửa vẫn có hàm băm. Tính toàn vẹn của tệp và sự thật âm học là hai khẳng định khác nhau, và bản xuất chỉ chống đỡ khẳng định thứ nhất."),
            ("Bản ghi điện thoại và máy đo cấp 1 hoặc cấp 2", "Máy đo cấp 1 hoặc cấp 2 theo IEC 61672-1 được kiểm như cả một thiết bị. Ở điểm chuẩn 1 kHz, khoảng chấp nhận khoảng ±1,1 dB cho cấp 1 và ±1,4 dB cho cấp 2, và nới rộng theo tần số, hướng và nhiệt độ. Chép đường cong trọng số A trong phần mềm không đưa điện thoại vào cấp nào. Dùng bản ghi điện thoại để cho thấy sự việc xảy ra khi nào, ở đâu và lớn cỡ nào, kèm âm thanh và ghi chú. Dùng máy đo đã kiểm định, theo phương pháp mà quy định nêu tên, khi một khoản phạt, phạt hợp đồng hoặc hồ sơ cưỡng chế phụ thuộc vào chính con số đó."),
        ],
        "second": "Giữ một phiên đo so được với phiên sau",
        "items": [
            "Cùng một điện thoại, cùng ốp, cùng trọng số, cùng đáp ứng Fast hoặc Slow.",
            "Micro cách sàn khoảng 1,2–1,5 m, không để trong túi và không áp vào tường.",
            "Ghi cửa sổ, nguồn khác, và khoảng cách nếu biết. Một đỉnh không có thời lượng khó so với LAeq hoặc liều 8 giờ.",
            "Nếu con số sẽ đặt cạnh một giới hạn, đặt độ lệch từ bộ hiệu chuẩn hoặc máy đo bạn tin, và giữ độ lệch trong bản xuất.",
            "Lưu cùng nhau âm thanh, CSV, PDF và bản kê. Hàm băm chỉ bao các tệp bạn thực sự băm.",
        ],
        "note": 'Đọc các con số trên <a class="in-content-link" href="{{standards}}">trang quy chuẩn</a> trước khi so một lần đo với WHO, OSHA hoặc quy định địa phương, và giữ tệp gốc cùng <a class="in-content-link" href="{{samples}}">mẫu hồ sơ</a>. Mở <a class="in-content-link" href="{{meter}}">bộ ghi</a> khi ghi chú đã sẵn. Bộ ghi không quyết định việc tuân thủ.',
    },
    "th": {
        "eyebrow": "ตัวเลขนี้หมายถึงอะไร",
        "title": "มิเตอร์บนเบราว์เซอร์ประมาณค่าเดซิเบลอย่างไร และสิ่งที่รับรองไม่ได้",
        "lead": "SOUNDTEST.PRO อ่านไมโครโฟนผ่าน Web Audio API ใช้ถ่วงน้ำหนักดิจิทัล A, C หรือ Z ที่จำลองตาม IEC 61672-1 แล้วบวกค่าชดเชยของอุปกรณ์ที่บันทึกไว้ ผลลัพธ์เป็นค่าประมาณภาคสนามสำหรับไทม์ไลน์ ไม่ใช่ค่าที่อ่านจากเครื่องวัดระดับเสียงที่สอบเทียบแล้ว",
        "cards": [
            ("เส้นทางของสัญญาณ", "เบราว์เซอร์ไม่ได้รับแรงดันดิบจากแคปซูล ระบบปฏิบัติการและเบราว์เซอร์ยังอาจใส่เกน เกนอัตโนมัติ การตัดเสียงรบกวน หรือการตัดเสียงสะท้อน ถ้าไม่ได้ปิดข้อจำกัดเหล่านั้น เคส นิ้ว ลม หรือโทรศัพท์คว่ำหน้า จะเปลี่ยนระดับก่อนที่ตัวกรองจะทำงาน โทรศัพท์สองเครื่องในห้องเดียวกันอาจต่างกันมากกว่าช่วงที่ยอมรับบนหน้าจอ แม้เครื่องมือทั้งสองชุดจะทำงานตามที่ออกแบบ"),
            ("±1 ถึง 5 dB ใช้เมื่อใด", "โปรไฟล์อุปกรณ์ที่มากับผลิตภัณฑ์ถูกจัดให้ตรงกับเครื่องวัดระดับเสียงอ้างอิงและเครื่องสอบเทียบเสียง 94 dB บนโทรศัพท์ทั่วไป ช่วงนี้สำหรับเสียงย่านพูด ช่องไมโครโฟนไม่ถูกบัง และโปรไฟล์ตรงกับเครื่องนั้น เบสทะลุผนัง ไซเรนเหนือย่านพูด ไมโครโฟนที่ถูกปิด หรือแล็ปท็อปที่ไม่มีโปรไฟล์ อาจอยู่นอกช่วง ช่องว่างที่กว้างขึ้นเป็นเหตุให้เก็บค่าชดเชยการสอบเทียบ ไม่ใช่เหตุให้เฉลี่ยโทรศัพท์สองเครื่องแล้วเรียกว่าค่าทางการ"),
            ("บรรทัด SHA-256 พิสูจน์อะไร", "แฮชในรายการคำนวณจากไบต์ของไฟล์ที่ส่งออก ถ้ามีคนแก้ CSV หรือ PDF แฮชจะไม่ตรงกัน มันไม่พิสูจน์ว่าไมโครโฟนแม่น GPS ชี้ถูกอาคาร หรือบันทึกอธิบายเหตุการณ์นั้น ไฟล์ที่หันผิดแต่ไม่ได้ถูกแก้ยังมีแฮช ความสมบูรณ์ของไฟล์กับความจริงทางเสียงเป็นคนละข้ออ้าง และการส่งออกรองรับเฉพาะข้อแรก"),
            ("บันทึกจากโทรศัพท์กับเครื่องวัดคลาส 1 หรือคลาส 2", "เครื่องวัดคลาส 1 หรือคลาส 2 ตาม IEC 61672-1 ถูกตรวจทั้งเครื่อง ที่จุดอ้างอิง 1 kHz ช่วงยอมรับอยู่ราว ±1.1 dB สำหรับคลาส 1 และ ±1.4 dB สำหรับคลาส 2 และจะกว้างขึ้นตามความถี่ ทิศทาง และอุณหภูมิ การคัดลอกเส้นถ่วงน้ำหนัก A ในซอฟต์แวร์ไม่ทำให้โทรศัพท์เข้าคลาสใดคลาสหนึ่ง ใช้บันทึกจากโทรศัพท์เพื่อแสดงว่าเหตุเกิดเมื่อใด ที่ใด และดังโดยประมาณเท่าใด พร้อมเสียงและบันทึก ใช้เครื่องวัดที่ผ่านการรับรองตามวิธีที่กฎระบุ เมื่อค่าปรับ เบี้ยปรับตามสัญญา หรือแฟ้มบังคับใช้ขึ้นกับตัวเลขนั้นเอง"),
        ],
        "second": "ให้รอบนี้เทียบกับรอบถัดไปได้",
        "items": [
            "โทรศัพท์เครื่องเดิม เคสเดิม การถ่วงน้ำหนักเดิม และการตอบสนอง Fast หรือ Slow แบบเดิม",
            "ไมโครโฟนสูงจากพื้นราว 1.2–1.5 ม. ไม่วางในกระเป๋าและไม่ชิดผนัง",
            "จดหน้าต่าง แหล่งเสียงอื่น และระยะทางถ้าทราบ จุดสูงสุดที่ไม่มีระยะเวลาเทียบกับ LAeq หรือขนาดยา 8 ชั่วโมงได้ยาก",
            "ถ้าจะวางตัวเลขข้างค่าจำกัด ให้ตั้งค่าชดเชยจากเครื่องสอบเทียบหรือเครื่องวัดที่เชื่อถือ และเก็บค่าชดเชยไว้ในไฟล์ส่งออก",
            "เก็บเสียง CSV PDF และรายการไว้ด้วยกัน แฮชครอบเฉพาะไฟล์ที่คำนวณแฮชจริง",
        ],
        "note": 'อ่านตัวเลขใน<a class="in-content-link" href="{{standards}}">หน้ามาตรฐาน</a>ก่อนเทียบรอบวัดกับ WHO, OSHA หรือกฎท้องถิ่น และเก็บไฟล์ดิบตาม<a class="in-content-link" href="{{samples}}">ตัวอย่างรายงาน</a> เปิด<a class="in-content-link" href="{{meter}}">เครื่องบันทึก</a>เมื่อบันทึกพร้อม เครื่องบันทึกไม่ตัดสินว่าผ่านเกณฑ์หรือไม่',
    },
}

STANDARDS = {
    "en": {
        "eyebrow": "Reference values, not a verdict",
        "title": "How to read the limits people quote",
        "lead": "The figures below are published reference values, and they are easy to misuse. A single phone reading in a bedroom is not an annual Lden, an 8-hour occupational dose, or a GB 3096 area measurement.",
        "cards": [
            ("WHO 2018", "The WHO Environmental Noise Guidelines for the European Region (2018) are public-health recommendations, not a city ordinance. The strong recommendations for long-term average exposure are about 53 dB Lden and 45 dB Lnight for road traffic, 54 dB Lden and 44 dB Lnight for rail, and 45 dB Lden and 40 dB Lnight for aircraft. Lden and Lnight describe long periods. One evening of footsteps cannot be subtracted from 45 dB to prove a breach."),
            ("OSHA and NIOSH", "OSHA 29 CFR 1910.95 sets a 90 dBA 8-hour time-weighted average as the permissible exposure limit and an 85 dBA action level, with a 5 dB exchange rate. NIOSH recommends 85 dBA over 8 hours with a 3 dB exchange rate. A short peak, even a loud one, is not that dose. Record how long the meter ran, and do not label a one-minute LAeq as an 8-hour TWA."),
            ("IEC 61672-1 and ISO 1996", "IEC 61672-1:2013 is the sound level meter standard. Class tolerances apply to the whole instrument under a reference direction, level, and environment. At 1 kHz those acceptance intervals are about ±1.1 dB (Class 1) and ±1.4 dB (Class 2). ISO 1996 describes how environmental noise is described and assessed: residual sound, the time interval, tones, and impulses. Using that vocabulary in the notes (start, duration, place, what else was audible) makes a record easier for someone else to read. It does not certify the microphone."),
            ("Local rules, including GB 3096", "Cities, leases, and building rules use their own hours and limits. China's GB 3096-2008 sets environmental quality limits by functional area: about 50/40 dB (day/night) in Class 0, 55/45 in Class 1, 60/50 in Class 2, 65/55 in Class 3, and 70/55 (4a) or 70/60 (4b). Those are area limits measured by that standard's method, not a phone at a pillow. Germany's TA Lärm and other national methods are the same kind of mismatch: the number in the guideline and the number on a handset answer different questions."),
        ],
        "second": "What to write down if someone will compare the record with a limit",
        "items": [
            "Clock time with the time zone, and whether you mean daytime or nighttime as that city defines it.",
            "Duration, and whether the value is a short peak, a Fast or Slow display, or an equivalent level over the whole take.",
            "Indoors or outdoors, floor, windows open or closed, and distance to the source if you know it.",
            "The weighting and time response on screen (A, C, or Z; Fast or Slow) and the phone model.",
            "A plain sentence that the value is an estimate from an uncalibrated microphone unless an offset was applied against a calibrator or a reference meter.",
            "The decision the record is for: a sleep timeline, a lease quiet-hours note, or a workplace screening. The export does not decide compliance.",
        ],
        "note": 'Pair this page with the <a class="in-content-link" href="{{accuracy}}">accuracy limits</a> and the <a class="in-content-link" href="{{levels}}">decibel chart</a>. Open the <a class="in-content-link" href="{{meter}}">recorder</a> only to document the event. A certified meter is still required when the number itself has to meet a statutory method.',
    },
    "zh": {
        "eyebrow": "参考值，不是结论",
        "title": "别人引用的限值应当怎么读",
        "lead": "下面的数字都有公开出处，也很容易被用错。卧室里一次手机读数不是全年 Lden，不是 8 小时职业剂量，也不是 GB 3096 的区域测量。",
        "cards": [
            ("WHO 2018", "《世界卫生组织欧洲区域环境噪声指南》（2018）是公共卫生建议，不是某座城市的条例。对长期平均暴露的强烈建议大约是：道路交通 Lden 53 dB、Lnight 45 dB；铁路 Lden 54 dB、Lnight 44 dB；航空器 Lden 45 dB、Lnight 40 dB。Lden 和 Lnight 描述的是很长一段时间。不能用一个晚上的脚步声去减 45 dB，然后声称已经证明违规。"),
            ("OSHA 与 NIOSH", "OSHA 29 CFR 1910.95 把 90 dBA 的 8 小时时间加权平均定为允许暴露限值，把 85 dBA 定为行动水平，交换率为 5 dB。NIOSH 建议 8 小时 85 dBA，交换率为 3 dB。一段很短的峰值，即使很响，也不是那个剂量。记下仪器开了多久，不要把一分钟的 LAeq 标成 8 小时 TWA。"),
            ("IEC 61672-1 与 ISO 1996", "IEC 61672-1:2013 是声级计标准。等级容差针对的是整台仪器，并且在规定的参考方向、电平和环境下。在 1 kHz，接收区间大约是 1 级 ±1.1 dB、2 级 ±1.4 dB。ISO 1996 说明如何描述和评价环境噪声：残余声、时间间隔、纯音和脉冲。在备注里使用这套说法（开始、时长、地点、还能听到什么）会让别人更容易读这份记录。它不能为麦克风出具检定。"),
            ("当地规则，包括 GB 3096", "城市、租约和楼宇规则各自规定时段和限值。中国 GB 3096-2008 按功能区规定环境质量限值：0 类约昼间 50 / 夜间 40 dB，1 类 55/45，2 类 60/50，3 类 65/55，4a 类 70/55，4b 类 70/60。这是按该标准方法测得的区域限值，不是枕头边的手机。德国 TA Lärm 和其他国家的方法也是同一类错位：指南里的数字和手机上的数字回答的不是同一个问题。"),
        ],
        "second": "如果有人要把记录和限值对照，应写下什么",
        "items": [
            "带时区的钟点，以及你说的白天或夜间是按那座城市的定义。",
            "时长，以及这个值是短时峰值、Fast 或 Slow 显示，还是整段录音的等效声级。",
            "室内或室外、楼层、门窗开闭，以及你知道的到声源的距离。",
            "屏幕上的计权和时间计权（A、C 或 Z；Fast 或 Slow），以及手机型号。",
            "写明：除非已经用校准器或参考声级计设置过偏移，否则该值是未经检定麦克风的估计。",
            "这份记录要支持的决定是什么：睡眠时间线、租约安静时段的说明，还是工作场所的筛查。导出文件不判断是否达标。",
        ],
        "note": '把本页和<a class="in-content-link" href="{{accuracy}}">精度边界</a>、<a class="in-content-link" href="{{levels}}">分贝对照表</a>一起看。打开<a class="in-content-link" href="{{meter}}">记录工具</a>只为把事件记下来。当数字本身必须满足法定方法时，仍需要经检定的声级计。',
    },
    "es": {
        "eyebrow": "Valores de referencia, no un veredicto",
        "title": "Cómo leer los límites que se citan",
        "lead": "Las cifras de abajo son valores de referencia publicados, y es fácil usarlas mal. Una sola lectura de teléfono en un dormitorio no es un Lden anual, ni una dosis laboral de 8 horas, ni una medición de zona según GB 3096.",
        "cards": [
            ("OMS 2018", "Las Guías de la OMS sobre el ruido ambiental para la Región de Europa (2018) son recomendaciones de salud pública, no una ordenanza municipal. Las recomendaciones firmes para la exposición media a largo plazo son unos 53 dB Lden y 45 dB Lnight para el tráfico rodado, 54 dB Lden y 44 dB Lnight para el ferrocarril, y 45 dB Lden y 40 dB Lnight para aeronaves. Lden y Lnight describen periodos largos. Una noche de pisadas no se resta de 45 dB para demostrar un incumplimiento."),
            ("OSHA y NIOSH", "OSHA 29 CFR 1910.95 fija 90 dBA de promedio ponderado en 8 horas como límite de exposición permisible y 85 dBA como nivel de acción, con una tasa de intercambio de 5 dB. NIOSH recomienda 85 dBA en 8 horas con una tasa de 3 dB. Un pico breve, aunque sea fuerte, no es esa dosis. Anote cuánto tiempo estuvo encendido el medidor y no etiquete un LAeq de un minuto como un TWA de 8 horas."),
            ("IEC 61672-1 e ISO 1996", "IEC 61672-1:2013 es la norma del sonómetro. Las tolerancias de clase se aplican al instrumento completo bajo una dirección, un nivel y un entorno de referencia. A 1 kHz esos intervalos de aceptación son de unos ±1,1 dB (clase 1) y ±1,4 dB (clase 2). ISO 1996 describe cómo se describe y evalúa el ruido ambiental: sonido residual, intervalo de tiempo, tonos e impulsos. Usar ese vocabulario en las notas (inicio, duración, lugar, qué más se oía) hace el registro más fácil de leer. No certifica el micrófono."),
            ("Reglas locales, incluida GB 3096", "Las ciudades, los contratos y las normas del edificio usan sus propios horarios y límites. La GB 3096-2008 de China fija límites de calidad ambiental por zona funcional: unos 50/40 dB (día/noche) en clase 0, 55/45 en clase 1, 60/50 en clase 2, 65/55 en clase 3, y 70/55 (4a) o 70/60 (4b). Son límites de zona medidos por el método de esa norma, no un teléfono en la almohada. El TA Lärm alemán y otros métodos nacionales son el mismo tipo de desajuste: el número de la guía y el número del teléfono responden preguntas distintas."),
        ],
        "second": "Qué anotar si alguien comparará el registro con un límite",
        "items": [
            "Hora de reloj con la zona horaria, y si «día» o «noche» es el que define esa ciudad.",
            "Duración, y si el valor es un pico breve, una lectura Fast o Slow, o un nivel equivalente de toda la toma.",
            "Interior o exterior, planta, ventanas abiertas o cerradas, y distancia a la fuente si la conoce.",
            "La ponderación y la respuesta temporal en pantalla (A, C o Z; Fast o Slow) y el modelo del teléfono.",
            "Una frase clara: el valor es una estimación de un micrófono no calibrado, salvo que se haya aplicado un desplazamiento con un calibrador o un medidor de referencia.",
            "La decisión para la que sirve el registro: una línea de tiempo del sueño, una nota de horas de silencio del contrato, o un cribado laboral. La exportación no decide el cumplimiento.",
        ],
        "note": 'Combine esta página con los <a class="in-content-link" href="{{accuracy}}">límites de precisión</a> y la <a class="in-content-link" href="{{levels}}">tabla de decibelios</a>. Abra la <a class="in-content-link" href="{{meter}}">grabadora</a> solo para documentar el suceso. Sigue haciendo falta un sonómetro certificado cuando el número en sí deba cumplir un método legal.',
    },
    "fr": {
        "eyebrow": "Valeurs de référence, pas un verdict",
        "title": "Comment lire les limites que l’on cite",
        "lead": "Les chiffres ci-dessous sont des valeurs de référence publiées, et il est facile de les détourner. Une seule lecture de téléphone dans une chambre n’est pas un Lden annuel, ni une dose professionnelle de 8 heures, ni une mesure de zone selon GB 3096.",
        "cards": [
            ("OMS 2018", "Les lignes directrices de l’OMS sur le bruit dans l’environnement pour la Région européenne (2018) sont des recommandations de santé publique, pas un arrêté municipal. Les recommandations fortes pour l’exposition moyenne de longue durée sont d’environ 53 dB Lden et 45 dB Lnight pour le trafic routier, 54 dB Lden et 44 dB Lnight pour le rail, et 45 dB Lden et 40 dB Lnight pour les aéronefs. Lden et Lnight décrivent de longues périodes. Une soirée de pas ne se soustrait pas de 45 dB pour prouver un manquement."),
            ("OSHA et NIOSH", "L’OSHA 29 CFR 1910.95 fixe 90 dBA en moyenne pondérée sur 8 heures comme limite d’exposition admissible et 85 dBA comme niveau d’action, avec un taux d’échange de 5 dB. Le NIOSH recommande 85 dBA sur 8 heures avec un taux de 3 dB. Une crête brève, même forte, n’est pas cette dose. Notez combien de temps l’appareil a tourné, et n’appelez pas un LAeq d’une minute un TWA de 8 heures."),
            ("IEC 61672-1 et ISO 1996", "L’IEC 61672-1:2013 est la norme des sonomètres. Les tolérances de classe s’appliquent à l’instrument entier sous une direction, un niveau et un environnement de référence. À 1 kHz, ces intervalles d’acceptation sont d’environ ±1,1 dB (classe 1) et ±1,4 dB (classe 2). L’ISO 1996 décrit comment le bruit environnemental est décrit et évalué : bruit résiduel, intervalle de temps, sons purs et impulsions. Employer ce vocabulaire dans les notes (début, durée, lieu, ce qui était encore audible) rend le relevé plus lisible. Cela ne certifie pas le microphone."),
            ("Règles locales, dont GB 3096", "Les villes, les baux et les règlements d’immeuble ont leurs propres horaires et limites. La GB 3096-2008 chinoise fixe des limites de qualité de l’environnement par zone fonctionnelle : environ 50/40 dB (jour/nuit) en classe 0, 55/45 en classe 1, 60/50 en classe 2, 65/55 en classe 3, et 70/55 (4a) ou 70/60 (4b). Ce sont des limites de zone mesurées selon la méthode de cette norme, pas un téléphone sur l’oreiller. Le TA Lärm allemand et d’autres méthodes nationales sont le même décalage : le chiffre du guide et le chiffre du téléphone ne répondent pas à la même question."),
        ],
        "second": "Quoi noter si quelqu’un comparera le relevé à une limite",
        "items": [
            "L’heure avec le fuseau, et si « jour » ou « nuit » est celui que définit cette ville.",
            "La durée, et si la valeur est une crête brève, un affichage Fast ou Slow, ou un niveau équivalent sur toute la prise.",
            "Intérieur ou extérieur, étage, fenêtres ouvertes ou fermées, et distance à la source si vous la connaissez.",
            "La pondération et la réponse temporelle à l’écran (A, C ou Z ; Fast ou Slow) et le modèle du téléphone.",
            "Une phrase simple : la valeur est une estimation d’un microphone non étalonné, sauf si un décalage a été appliqué avec un calibreur ou un sonomètre de référence.",
            "La décision que le relevé doit éclairer : une chronologie de sommeil, une note sur les heures calmes du bail, ou un dépistage au travail. L’export ne décide pas de la conformité.",
        ],
        "note": 'Associez cette page aux <a class="in-content-link" href="{{accuracy}}">limites de précision</a> et au <a class="in-content-link" href="{{levels}}">tableau des décibels</a>. Ouvrez l’<a class="in-content-link" href="{{meter}}">enregistreur</a> seulement pour documenter l’événement. Un sonomètre certifié reste nécessaire lorsque le chiffre lui-même doit respecter une méthode réglementaire.',
    },
    "de": {
        "eyebrow": "Referenzwerte, kein Urteil",
        "title": "Wie man zitierte Grenzwerte liest",
        "lead": "Die folgenden Zahlen sind veröffentlichte Referenzwerte, und sie lassen sich leicht falsch verwenden. Eine einzelne Telefonablesung im Schlafzimmer ist kein jährlicher Lden, keine 8-Stunden-Arbeitsplatzdosis und keine Gebietsmessung nach GB 3096.",
        "cards": [
            ("WHO 2018", "Die WHO-Leitlinien für Umgebungslärm in der Europäischen Region (2018) sind Empfehlungen zum Gesundheitsschutz, keine städtische Verordnung. Die starken Empfehlungen für die langfristige mittlere Belastung liegen bei etwa 53 dB Lden und 45 dB Lnight für Straßenverkehr, 54 dB Lden und 44 dB Lnight für Schienenverkehr und 45 dB Lden und 40 dB Lnight für Flugzeuge. Lden und Lnight beschreiben lange Zeiträume. Ein Abend mit Schritten lässt sich nicht von 45 dB abziehen, um einen Verstoß zu belegen."),
            ("OSHA und NIOSH", "OSHA 29 CFR 1910.95 setzt 90 dBA als zulässigen 8-Stunden-Mittelungspegel und 85 dBA als Auslöseschwelle, mit einer Wechselrate von 5 dB. NIOSH empfiehlt 85 dBA über 8 Stunden mit einer Wechselrate von 3 dB. Eine kurze Spitze, auch eine laute, ist nicht diese Dosis. Notieren Sie, wie lange das Gerät lief, und nennen Sie einen einminütigen LAeq nicht einen 8-Stunden-TWA."),
            ("IEC 61672-1 und ISO 1996", "IEC 61672-1:2013 ist die Norm für Schallpegelmesser. Klassentoleranzen gelten für das ganze Gerät unter einer Referenzrichtung, einem Referenzpegel und einer Referenzumgebung. Bei 1 kHz liegen diese Annahmeintervalle bei etwa ±1,1 dB (Klasse 1) und ±1,4 dB (Klasse 2). ISO 1996 beschreibt, wie Umgebungslärm beschrieben und beurteilt wird: Restgeräusch, Zeitintervall, Töne und Impulse. Diese Begriffe in den Notizen (Beginn, Dauer, Ort, was sonst hörbar war) machen die Aufzeichnung für andere lesbarer. Sie eichen das Mikrofon nicht."),
            ("Örtliche Regeln, einschließlich GB 3096", "Städte, Mietverträge und Hausordnungen haben eigene Zeiten und Grenzen. Chinas GB 3096-2008 setzt Umweltqualitätsgrenzwerte nach Funktionsgebiet: etwa 50/40 dB (Tag/Nacht) in Klasse 0, 55/45 in Klasse 1, 60/50 in Klasse 2, 65/55 in Klasse 3 und 70/55 (4a) oder 70/60 (4b). Das sind Gebietsgrenzwerte nach dem Verfahren dieser Norm, kein Telefon am Kopfkissen. Die deutsche TA Lärm und andere nationale Verfahren sind dieselbe Art von Versatz: Die Zahl in der Richtlinie und die Zahl auf dem Handy beantworten verschiedene Fragen."),
        ],
        "second": "Was zu notieren ist, wenn jemand die Aufzeichnung mit einem Grenzwert vergleicht",
        "items": [
            "Uhrzeit mit Zeitzone, und ob Tag oder Nacht so gemeint ist, wie diese Stadt sie definiert.",
            "Dauer, und ob der Wert eine kurze Spitze, eine Fast- oder Slow-Anzeige oder ein äquivalenter Pegel über die ganze Aufnahme ist.",
            "Drinnen oder draußen, Geschoss, Fenster auf oder zu, und Entfernung zur Quelle, wenn Sie sie kennen.",
            "Bewertung und Zeitbewertung auf dem Bildschirm (A, C oder Z; Fast oder Slow) und das Telefonmodell.",
            "Ein klarer Satz: Der Wert ist eine Schätzung eines unkalibrierten Mikrofons, sofern nicht ein Offset gegen einen Kalibrator oder ein Referenzgerät gesetzt wurde.",
            "Wofür die Aufzeichnung da ist: ein Schlafverlauf, ein Hinweis auf Ruhezeiten im Mietvertrag oder ein Screening am Arbeitsplatz. Der Export entscheidet nicht über Einhaltung.",
        ],
        "note": 'Lesen Sie diese Seite zusammen mit den <a class="in-content-link" href="{{accuracy}}">Genauigkeitsgrenzen</a> und der <a class="in-content-link" href="{{levels}}">Dezibeltabelle</a>. Öffnen Sie den <a class="in-content-link" href="{{meter}}">Recorder</a> nur, um das Ereignis zu dokumentieren. Ein geeichtes Messgerät bleibt nötig, wenn die Zahl selbst ein gesetzliches Verfahren erfüllen muss.',
    },
    "ja": {
        "eyebrow": "参照値であり、判定ではない",
        "title": "引用される限度値の読み方",
        "lead": "下の数字は公表された参照値で、誤用しやすいものです。寝室での電話の 1 回の読みは、年間の Lden でも、8 時間の職業ばく露量でも、GB 3096 の地域測定でもありません。",
        "cards": [
            ("WHO 2018", "WHO 欧州地域の環境騒音ガイドライン（2018）は公衆衛生上の勧告であり、市の条例ではありません。長期平均ばく露への強い勧告は、道路交通で Lden 約 53 dB・Lnight 45 dB、鉄道で Lden 54 dB・Lnight 44 dB、航空機で Lden 45 dB・Lnight 40 dB です。Lden と Lnight は長い期間を表します。一晩の足音を 45 dB から引いて、違反を証明したことにはなりません。"),
            ("OSHA と NIOSH", "OSHA 29 CFR 1910.95 は、8 時間の時間加重平均 90 dBA を許容ばく露限界、85 dBA を措置レベルとし、交換率は 5 dB です。NIOSH は 8 時間 85 dBA、交換率 3 dB を勧告します。短いピークは、大きくてもそのばく露量ではありません。計器を動かした時間を記録し、1 分間の LAeq を 8 時間 TWA と呼ばないでください。"),
            ("IEC 61672-1 と ISO 1996", "IEC 61672-1:2013 はサウンドレベルメータの規格です。クラスの許容差は、基準の方向、レベル、環境のもとでの機器全体に適用されます。1 kHz での許容区間はおよそクラス 1 で ±1.1 dB、クラス 2 で ±1.4 dB です。ISO 1996 は環境騒音の記述と評価の仕方を定めています。残留騒音、時間間隔、純音、衝撃です。メモにその言葉（開始、長さ、場所、ほかに何が聞こえたか）を使うと、他の人が記録を読みやすくなります。マイクを検定したことにはなりません。"),
            ("地域の規則と GB 3096", "都市、賃貸契約、建物の規則は、それぞれの時間帯と限度を使います。中国の GB 3096-2008 は機能地域ごとの環境基準を定めています。0 類はおよそ昼 50 / 夜 40 dB、1 類 55/45、2 類 60/50、3 類 65/55、4a 類 70/55、4b 類 70/60 です。これはその規格の方法で測る地域の限度であり、枕元の電話ではありません。ドイツの TA Lärm や他国の方法も同じ種類のずれです。指針の数字と端末の数字は、別の問いに答えています。"),
        ],
        "second": "記録を限度値と比べる人がいるときに書くこと",
        "items": [
            "タイムゾーン付きの時刻。昼と夜がその都市の定義のどれを指すか。",
            "長さ。値が短いピークか、Fast または Slow の表示か、録音全体の等価レベルか。",
            "屋内か屋外か、階、窓の開閉、分かるなら音源までの距離。",
            "画面の周波数重み付けと時間重み付け（A、C、Z、Fast または Slow）と電話の機種。",
            "校正器または基準器でオフセットを入れていない限り、未校正マイクの推定値である、という一文。",
            "記録が支える判断。睡眠の時系列、契約の静穏時間のメモ、職場のスクリーニング。書き出しは適合を決めません。",
        ],
        "note": 'このページは<a class="in-content-link" href="{{accuracy}}">精度の限界</a>と<a class="in-content-link" href="{{levels}}">デシベル表</a>と一緒に読んでください。出来事を記録するためだけに<a class="in-content-link" href="{{meter}}">記録ツール</a>を開きます。数値そのものが法定の方法を満たす必要があるときは、検定済みの騒音計が引き続き必要です。',
    },
    "ko": {
        "eyebrow": "참고값이지, 판정이 아닙니다",
        "title": "인용되는 한계값을 읽는 법",
        "lead": "아래 숫자는 공개된 참고값이며 오용하기 쉽습니다. 침실에서 전화로 한 번 읽은 값은 연간 Lden 도, 8시간 직업 노출량도, GB 3096 의 지역 측정도 아닙니다.",
        "cards": [
            ("WHO 2018", "WHO 유럽 지역 환경소음 가이드라인(2018)은 공중보건 권고이며 시 조례가 아닙니다. 장기 평균 노출에 대한 강한 권고는 도로 교통 Lden 약 53 dB · Lnight 45 dB, 철도 Lden 54 dB · Lnight 44 dB, 항공기 Lden 45 dB · Lnight 40 dB 입니다. Lden 과 Lnight 는 긴 기간을 말합니다. 하룻밤의 발소리를 45 dB 에서 빼서 위반을 증명할 수는 없습니다."),
            ("OSHA 와 NIOSH", "OSHA 29 CFR 1910.95 는 8시간 시간가중평균 90 dBA 를 허용 노출 한계로, 85 dBA 를 조치 수준으로 두고 교환율은 5 dB 입니다. NIOSH 는 8시간 85 dBA, 교환율 3 dB 를 권고합니다. 짧은 피크는 커도 그 노출량이 아닙니다. 계기를 켠 시간을 적고, 1분 LAeq 를 8시간 TWA 라고 부르지 마십시오."),
            ("IEC 61672-1 과 ISO 1996", "IEC 61672-1:2013 은 소음계 표준입니다. 등급 허용차는 기준 방향, 레벨, 환경에서 기기 전체에 적용됩니다. 1 kHz 에서 그 허용 구간은 대략 1급 ±1.1 dB, 2급 ±1.4 dB 입니다. ISO 1996 은 환경소음을 어떻게 기술하고 평가하는지를 다룹니다. 잔여음, 시간 구간, 순음, 충격음입니다. 메모에 그 말(시작, 길이, 장소, 그 밖에 무엇이 들렸는지)을 쓰면 다른 사람이 기록을 읽기 쉽습니다. 마이크를 검정한 것은 아닙니다."),
            ("지역 규칙과 GB 3096", "도시, 임대차, 건물 규칙은 각자의 시간과 한계를 씁니다. 중국 GB 3096-2008 은 기능 지역별 환경 기준을 둡니다. 0류는 대략 주간 50 / 야간 40 dB, 1류 55/45, 2류 60/50, 3류 65/55, 4a류 70/55, 4b류 70/60 입니다. 그 표준의 방법으로 잰 지역 한계이지, 베개 옆 전화가 아닙니다. 독일 TA Lärm 과 다른 국가의 방법도 같은 종류의 어긋남입니다. 지침의 숫자와 단말의 숫자는 다른 질문에 답합니다."),
        ],
        "second": "기록을 한계값과 비교할 사람이 있을 때 적을 것",
        "items": [
            "시간대까지 포함한 시각. 낮과 밤이 그 도시 정의의 어느 쪽인지.",
            "길이. 값이 짧은 피크인지, Fast 또는 Slow 표시인지, 녹음 전체의 등가 레벨인지.",
            "실내인지 실외인지, 층, 창문의 개폐, 안다면 음원까지의 거리.",
            "화면의 가중과 시간 가중(A, C, Z, Fast 또는 Slow)과 전화 기종.",
            "교정기나 기준기로 오프셋을 넣지 않았다면 미교정 마이크의 추정값이라는 한 문장.",
            "기록이 받치는 판단. 수면 시간표, 계약의 정온 시간 메모, 작업장 선별. 내보내기는 적합을 결정하지 않습니다.",
        ],
        "note": '이 페이지는 <a class="in-content-link" href="{{accuracy}}">정밀도 한계</a> 및 <a class="in-content-link" href="{{levels}}">데시벨 표</a>와 함께 읽으세요. 사건을 기록하려고만 <a class="in-content-link" href="{{meter}}">기록 도구</a>를 엽니다. 숫자 자체가 법정 방법을 충족해야 하면 검정된 소음계가 여전히 필요합니다.',
    },
    "vi": {
        "eyebrow": "Giá trị tham chiếu, không phải phán quyết",
        "title": "Cách đọc các giới hạn người ta trích dẫn",
        "lead": "Các con số dưới đây là giá trị tham chiếu đã công bố, và rất dễ dùng sai. Một lần đọc bằng điện thoại trong phòng ngủ không phải Lden cả năm, không phải liều nghề nghiệp 8 giờ, cũng không phải phép đo vùng theo GB 3096.",
        "cards": [
            ("WHO 2018", "Hướng dẫn tiếng ồn môi trường của WHO cho khu vực châu Âu (2018) là khuyến nghị y tế công cộng, không phải sắc lệnh của thành phố. Khuyến nghị mạnh cho phơi nhiễm trung bình dài hạn là khoảng 53 dB Lden và 45 dB Lnight với giao thông đường bộ, 54 dB Lden và 44 dB Lnight với đường sắt, 45 dB Lden và 40 dB Lnight với máy bay. Lden và Lnight mô tả khoảng thời gian dài. Một buổi tối tiếng bước chân không thể lấy 45 dB trừ đi để chứng minh vi phạm."),
            ("OSHA và NIOSH", "OSHA 29 CFR 1910.95 đặt trung bình gia quyền 8 giờ 90 dBA làm giới hạn phơi nhiễm cho phép và 85 dBA làm mức hành động, tỷ lệ trao đổi 5 dB. NIOSH khuyến nghị 85 dBA trong 8 giờ với tỷ lệ trao đổi 3 dB. Một đỉnh ngắn, dù lớn, không phải liều đó. Ghi máy chạy bao lâu, và đừng gọi LAeq một phút là TWA 8 giờ."),
            ("IEC 61672-1 và ISO 1996", "IEC 61672-1:2013 là tiêu chuẩn máy đo mức âm. Dung sai cấp áp cho cả thiết bị trong hướng, mức và môi trường chuẩn. Ở 1 kHz các khoảng chấp nhận đó khoảng ±1,1 dB (cấp 1) và ±1,4 dB (cấp 2). ISO 1996 mô tả cách mô tả và đánh giá tiếng ồn môi trường: âm dư, khoảng thời gian, âm đơn và xung. Dùng từ đó trong ghi chú (bắt đầu, thời lượng, nơi, còn nghe thấy gì) giúp người khác đọc bản ghi dễ hơn. Nó không kiểm định micro."),
            ("Quy định địa phương, gồm GB 3096", "Thành phố, hợp đồng thuê và nội quy tòa nhà dùng giờ và giới hạn riêng. GB 3096-2008 của Trung Quốc đặt giới hạn chất lượng môi trường theo vùng chức năng: khoảng 50/40 dB (ngày/đêm) ở loại 0, 55/45 loại 1, 60/50 loại 2, 65/55 loại 3, và 70/55 (4a) hoặc 70/60 (4b). Đó là giới hạn vùng đo theo phương pháp của tiêu chuẩn ấy, không phải điện thoại ở gối. TA Lärm của Đức và phương pháp quốc gia khác là cùng một kiểu lệch: con số trong hướng dẫn và con số trên điện thoại trả lời hai câu hỏi khác nhau."),
        ],
        "second": "Nên ghi gì nếu có người so bản ghi với một giới hạn",
        "items": [
            "Giờ đồng hồ kèm múi giờ, và ngày hay đêm là theo định nghĩa của thành phố đó.",
            "Thời lượng, và giá trị là đỉnh ngắn, hiển thị Fast hoặc Slow, hay mức tương đương của cả lần đo.",
            "Trong nhà hay ngoài trời, tầng, cửa sổ đóng hay mở, và khoảng cách tới nguồn nếu biết.",
            "Trọng số và đáp ứng thời gian trên màn hình (A, C hoặc Z; Fast hoặc Slow) và kiểu điện thoại.",
            "Một câu rõ: giá trị là ước lượng từ micro chưa hiệu chuẩn, trừ khi đã đặt độ lệch bằng bộ hiệu chuẩn hoặc máy đo tham chiếu.",
            "Quyết định mà bản ghi phục vụ: dòng thời gian giấc ngủ, ghi chú giờ yên tĩnh trong hợp đồng, hay sàng lọc nơi làm việc. Bản xuất không quyết định việc tuân thủ.",
        ],
        "note": 'Đọc trang này cùng <a class="in-content-link" href="{{accuracy}}">giới hạn độ chính xác</a> và <a class="in-content-link" href="{{levels}}">bảng decibel</a>. Chỉ mở <a class="in-content-link" href="{{meter}}">bộ ghi</a> để ghi lại sự việc. Vẫn cần máy đo đã kiểm định khi chính con số phải đáp ứng một phương pháp luật định.',
    },
    "th": {
        "eyebrow": "ค่าอ้างอิง ไม่ใช่คำตัดสิน",
        "title": "วิธีอ่านค่าจำกัดที่คนยกมาอ้าง",
        "lead": "ตัวเลขด้านล่างเป็นค่าอ้างอิงที่เผยแพร่แล้ว และใช้ผิดได้ง่าย การอ่านจากโทรศัพท์ครั้งเดียวในห้องนอนไม่ใช่ Lden รายปี ไม่ใช่ขนาดยาอาชีวอนามัย 8 ชั่วโมง และไม่ใช่การวัดเขตตาม GB 3096",
        "cards": [
            ("WHO 2018", "แนวทางเสียงรบกวนสิ่งแวดล้อมของ WHO สำหรับภูมิภาคยุโรป (2018) เป็นข้อแนะนำด้านสาธารณสุข ไม่ใช่เทศบัญญัติ ข้อแนะนำเข้มสำหรับค่าเฉลี่ยระยะยาวอยู่ราว 53 dB Lden และ 45 dB Lnight สำหรับการจราจรทางถนน, 54 dB Lden และ 44 dB Lnight สำหรับราง, และ 45 dB Lden และ 40 dB Lnight สำหรับอากาศยาน Lden และ Lnight อธิบายช่วงเวลายาว เสียงฝีเท้าหนึ่งค่ำเอาไปลบจาก 45 dB เพื่อพิสูจน์การละเมิดไม่ได้"),
            ("OSHA และ NIOSH", "OSHA 29 CFR 1910.95 กำหนดค่าเฉลี่ยถ่วงเวลา 8 ชั่วโมงที่ 90 dBA เป็นขีดจำกัดการรับสัมผัสที่ยอมให้ และ 85 dBA เป็นระดับที่ต้องดำเนินการ อัตราแลกเปลี่ยน 5 dB NIOSH แนะนำ 85 dBA ใน 8 ชั่วโมง อัตราแลกเปลี่ยน 3 dB จุดสูงสุดสั้น ๆ แม้จะดัง ก็ไม่ใช่ขนาดยานั้น จดว่าเครื่องทำงานนานเท่าใด และอย่าเรียก LAeq หนึ่งนาทีว่า TWA 8 ชั่วโมง"),
            ("IEC 61672-1 และ ISO 1996", "IEC 61672-1:2013 เป็นมาตรฐานเครื่องวัดระดับเสียง ค่าเผื่อของคลาสใช้กับทั้งเครื่องภายใต้ทิศทาง ระดับ และสภาพอ้างอิง ที่ 1 kHz ช่วงยอมรับนั้นราว ±1.1 dB (คลาส 1) และ ±1.4 dB (คลาส 2) ISO 1996 อธิบายวิธีบรรยายและประเมินเสียงสิ่งแวดล้อม: เสียงตกค้าง ช่วงเวลา โทน และอิมพัลส์ การใช้คำเหล่านี้ในบันทึก (เริ่ม ระยะเวลา สถานที่ ได้ยินอะไรอีก) ทำให้คนอื่นอ่านบันทึกได้ง่ายขึ้น มันไม่รับรองไมโครโฟน"),
            ("กฎท้องถิ่น รวม GB 3096", "เมือง สัญญาเช่า และกฎอาคารใช้ชั่วโมงและค่าจำกัดของตนเอง GB 3096-2008 ของจีนกำหนดขีดคุณภาพสิ่งแวดล้อมตามเขตหน้าที่: ประมาณ 50/40 dB (กลางวัน/กลางคืน) ในคลาส 0, 55/45 คลาส 1, 60/50 คลาส 2, 65/55 คลาส 3, และ 70/55 (4a) หรือ 70/60 (4b) นี่คือค่าจำกัดของเขตที่วัดตามวิธีของมาตรฐานนั้น ไม่ใช่โทรศัพท์ที่หมอน TA Lärm ของเยอรมนีและวิธีของประเทศอื่นเป็นความคลาดเคลื่อนแบบเดียวกัน: ตัวเลขในแนวทางกับตัวเลขบนเครื่องตอบคนละคำถาม"),
        ],
        "second": "ควรจดอะไร ถ้าจะมีคนเทียบบันทึกกับค่าจำกัด",
        "items": [
            "เวลานาฬิกาพร้อมเขตเวลา และกลางวันหรือกลางคืนหมายถึงนิยามของเมืองนั้น",
            "ระยะเวลา และค่าเป็นจุดสูงสุดสั้น การแสดง Fast หรือ Slow หรือระดับสมมูลของการบันทึกทั้งช่วง",
            "ในหรือนอกอาคาร ชั้น หน้าต่างเปิดหรือปิด และระยะถึงแหล่งกำเนิดถ้าทราบ",
            "การถ่วงน้ำหนักและการตอบสนองเวลาบนจอ (A, C หรือ Z; Fast หรือ Slow) และรุ่นโทรศัพท์",
            "ประโยคตรง ๆ ว่าค่านี้เป็นค่าประมาณจากไมโครโฟนที่ยังไม่ได้สอบเทียบ เว้นแต่ได้ใส่ค่าชดเชยด้วยเครื่องสอบเทียบหรือเครื่องอ้างอิง",
            "การตัดสินใจที่บันทึกนี้รองรับ: ไทม์ไลน์การนอน บันทึกชั่วโมงเงียบในสัญญา หรือการคัดกรองในที่ทำงาน ไฟล์ส่งออกไม่ตัดสินการเป็นไปตามเกณฑ์",
        ],
        "note": 'อ่านหน้านี้คู่กับ<a class="in-content-link" href="{{accuracy}}">ขีดความแม่นยำ</a>และ<a class="in-content-link" href="{{levels}}">ตารางเดซิเบล</a> เปิด<a class="in-content-link" href="{{meter}}">เครื่องบันทึก</a>เพื่อบันทึกเหตุเท่านั้น เมื่อตัวเลขเองต้องเป็นไปตามวิธีที่กฎหมายกำหนด ยังต้องใช้เครื่องวัดที่ผ่านการรับรอง',
    },
}
