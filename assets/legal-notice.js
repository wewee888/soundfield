/* ==========================================================================
   SOUNDTEST.PRO - Legal Notice & Neighbor Communication Letter Engine
   Modular Component: 3 Tones x 9 Jurisdictions/Languages x Pure-JS DOCX
   Zero External Dependencies · Full Dynamic Lazy Mount
   ========================================================================== */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.SoundTestLegalNotice = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {

  const LEGAL_DATA = {
  "zh": {
    "name": "🇨🇳 中国 (民法典 & 噪声污染防治法)",
    "laws": [
      "《中华人民共和国民法典》第1032条：自然人享有隐私权。任何组织或者个人不得以刺探、侵扰、泄露、公开等方式侵害他人的隐私权。私人生活安宁受法律保护。",
      "《中华人民共和国民法典》第288条：不动产的相邻权利人应当按照有利生产、方便生活、团结互助、公平合理的原则，正确处理相邻关系。",
      "《中华人民共和国噪声污染防治法》第63条、第65条：禁止排放超过社会生活环境噪声排放标准的噪声；造成严重污染构成侵权的，应当依法承担民事法律责任。",
      "国家《声环境质量标准》(GB 3096-2008)：1类居民生活区夜间（22:00-06:00）等效连续声级限值为 45 dB(A)。"
    ],
    "scenarios": {
      "footstep": "沉重脚步踩踏声/跑跳声",
      "music": "高分贝电视/低音炮震动",
      "dragging": "深夜桌椅拖拽与硬物刮擦",
      "renovation": "非规定时段电钻或敲击施工",
      "pet": "宠物持续吠叫与跑动撞击",
      "party": "深夜聚会喧哗与大声争吵"
    },
    "tones": {
      "gentle": {
        "title": "邻里安宁生活作息友善提醒便条",
        "body": "尊重的邻居您好：\n\n冒昧打扰，特此给您留便条。俗话说远亲不如近邻，大家生活在同一栋楼非常难得。\n\n近期在夜间休息时段，由于建筑楼板共振与隔音有限，楼下频繁听到【{NOISE_TYPES}】的声音。经我们在家中实测，峰值声级达到了 {PEAK} dB(A)，给家人的正常睡眠和休息带来了一定打扰。\n\n我们理解大家生活作息各异，猜测您可能并不知情并非有意为之。特此温馨提醒，可否麻烦您在夜间休息时段（尤其是22:00之后）稍加注意，例如轻关门窗、穿软底拖鞋或为桌椅脚加装静音垫。非常感谢您的理解与包容，祝生活愉快！"
      },
      "firm": {
        "title": "关于夜间生活噪声超标干扰之正式交涉函",
        "body": "邻居您好：\n\n鉴于此前已曾就室内生活噪声问题予以沟通，但近期夜间时段仍反复出现【{NOISE_TYPES}】的严重干扰。\n\n根据我们在室内进行的现场客观声学监测事实，夜间监测时段等效连续声级 LAeq 达到 {LEQ} dB(A)，瞬时峰值声级 Lmax 高达 {PEAK} dB(A)，已显著超出国家《声环境质量标准》1类居住区夜间限值，严重破坏了我方的基本居住安宁与睡眠健康。\n\n良好的居住环境需要双方共同维护。我们正式要求您于夜间时段（22:00至次日07:00）切实采取消音减震措施，杜绝产生穿透性噪声。希望本着邻里理性精神在私下层面妥善解决，避免进一步向物业服务中心或社区居委会反映报备。"
      },
      "strict": {
        "title": "民事侵害生活安宁停止妨害催告函与法律告知书",
        "body": "致【{RECIPIENT}】：\n\n根据《中华人民共和国民法典》及《中华人民共和国噪声污染防治法》，自然人依法享有私人生活安宁权，禁止任何单位和个人排放超标社会生活噪声妨碍他人正常生活。\n\n现郑重告知：贵方所在房屋在夜间时段持续产生【{NOISE_TYPES}】，现场实测声级峰值高达 {PEAK} dB(A)，等效均值达 {LEQ} dB(A)。相关事实已通过 SOUNDTEST.PRO 存证引擎完成时间戳锁定与 SHA-256 数字防伪存证（存证编号：{EVIDENCE_ID}）。\n\n贵方行为已严重逾越法定义务与容忍限度，涉嫌构成对受函方合法生活安宁权的民事侵权妨害。特此限贵方于收到本函后 48 小时内彻底停止超标排噪行为。\n\n若逾期未改善，我方将依法向物业报备、向公安执法机关（110/12345）提请行政取证查处，并保留提起排除妨害诉讼及主张精神损害赔偿之一切法定权利。"
      }
    },
    "ui": {
      "title": "邻里沟通函与法定催告函生成器",
      "subtitle": "基于真实声学存证数据 · 3种沟通语气 · 9国/地区法律条文智能援引",
      "toneLabel": "沟通语气策略",
      "toneHint": "阶梯式维权：温和提醒 → 理性交涉 → 严正催告",
      "toneGentle": "温和友善提醒",
      "toneGentleDesc": "以和为贵，初次提醒，理解可能不知情，倡导友好邻里互助",
      "toneFirm": "正式理性交涉",
      "toneFirmDesc": "多次沟通未果，摆出客观声学超标数据，明确作息干扰与底线",
      "toneStrict": "严正法务催告",
      "toneStrictDesc": "正式法律告知书格式，援引法定侵权法规，设定整改限期与通牒",
      "badgeFree": "免费开放",
      "badgePro": "🔒 专业版",
      "lblRecipient": "受函方 / 邻居称呼",
      "lblSender": "发函方 / 您的署名",
      "lblJurisdiction": "法律法域与语言 (9国标准)",
      "scenarioLabel": "常见噪音类型 (快速勾选)",
      "lblPeak": "实测峰值 Lmax",
      "lblAvg": "等效均值 LAeq",
      "lblTime": "监测时段",
      "lblHash": "数字存证指纹",
      "articlesTitle": "法定法规依据与法律条文 (Statutory Provisions)",
      "legalHeaderTitle": "法定法规依据与法律条文",
      "previewLabel": "文书实时预览",
      "previewHint": "所见即所得 · 自动排版",
      "btnClose": "关闭",
      "btnCopy": "复制文本",
      "btnDocx": "导出 Word (.docx)",
      "btnPdf": "导出排版 PDF",
      "copied": "✓ 已成功复制函件全文至剪贴板",
      "date": "日期：",
      "evidence": "存证编号：",
      "recipientDefault": "楼上邻居您好",
      "senderDefault": "楼下邻居",
      "thMetric": "声学监测指标",
      "thValue": "实测读数",
      "telemetryHeader": "【现场声学测量数据证据表】",
      "legalHeader": "【法定法规条文与法律依据】",
      "lblSign": "通知方签署: ",
      "lblSignDate": "签署日期: ",
      "disclaimer": "注：本函及所附声学数据为民事自查事实记录，用于敦促沟通与民事纠纷举证，非国家法定计量检定证书。司法或法定仲裁裁决建议结合具有法定资质的第三方检测机构出具之报告。"
    }
  },
  "en": {
    "name": "🇺🇸/🇬🇧 US & UK (Common Law & Quiet Enjoyment)",
    "laws": [
      "Common Law Covenant of Quiet Enjoyment: Every residential tenant and property owner possesses the implied covenant of quiet enjoyment, guaranteeing peaceful occupation free from unreasonable interference.",
      "Doctrine of Private Nuisance: Actionable nuisance arises when sound transmissions create substantial and unreasonable interference with the comfortable use and enjoyment of real property.",
      "World Health Organization (WHO) Night Noise Guidelines: Nighttime noise levels exceeding 40-45 dB(A) inside bedrooms represent a documented hazard to restorative sleep and cardiovascular health.",
      "Municipal Environmental Protection & Noise Abatement Ordinances: Setting strict nighttime decibel thresholds for multi-family residential dwellings."
    ],
    "scenarios": {
      "footstep": "Heavy stomping, running, or heel impact",
      "music": "Loud TV, stereo bass vibration",
      "dragging": "Furniture scraping or hard object dropping late at night",
      "renovation": "Drilling, hammering, or unauthorized DIY work",
      "pet": "Continuous pet barking or jumping",
      "party": "Late night shouting, gathering, or loud conversations"
    },
    "tones": {
      "gentle": {
        "title": "Friendly Neighborhood Note: Sound & Rest Hours",
        "body": "Dear Neighbor,\n\nI hope you are doing well! I wanted to reach out with a quick, friendly note regarding sound transmission between our units.\n\nDue to the acoustic construction of our building, sounds of 【{NOISE_TYPES}】 carry quite clearly into my apartment during nighttime resting hours. Our home sound meter recorded peak levels reaching {PEAK} dB(A), which has occasionally disrupted our sleep.\n\nI completely understand that noise often travels more than we realize and that this is entirely unintentional on your part. If possible, would you mind keeping an eye on floor impacts during late hours (for example, wearing soft indoor slippers or placing felt pads under chair legs)?\n\nThank you so much for your understanding and neighborly consideration!"
      },
      "firm": {
        "title": "Formal Notice Concerning Unreasonable Residential Noise Disturbance",
        "body": "Dear Resident,\n\nI am writing to formally address the ongoing noise disturbances originating from your premises, specifically 【{NOISE_TYPES}】 during quiet hours.\n\nObjective acoustic monitoring conducted in our dwelling documented an equivalent continuous sound level (LAeq) of {LEQ} dB(A) and peak levels (Lmax) reaching {PEAK} dB(A), which substantially exceed standard residential nighttime thresholds.\n\nThis continuous disturbance has caused severe sleep deprivation and distress. We respectfully request that you take immediate, effective corrective measures to dampen impact noise between 10:00 PM and 7:00 AM. We hope to resolve this reasonably between neighbors without the need to escalate this matter to building management or property administration."
      },
      "strict": {
        "title": "FORMAL NOTICE AND STATUTORY DEMAND TO CEASE NOISE NUISANCE",
        "body": "To: 【{RECIPIENT}】\n\nNOTICE IS HEREBY GIVEN that you are causing a substantial and unreasonable noise disturbance interfering with the lawful covenant of quiet enjoyment and peaceful occupation of adjacent residential premises, contrary to common law nuisance principles and statutory noise control standards.\n\nEmpirical acoustic monitoring between {TIME_RANGE} recorded peak noise levels (Lmax) of {PEAK} dB(A) and equivalent levels (LAeq) of {LEQ} dB(A), primarily attributable to 【{NOISE_TYPES}】. This telemetry log is cryptographically sealed with SHA-256 fingerprint {EVIDENCE_ID}.\n\nDEMAND IS HEREBY MADE that you immediately CEASE AND DESIST from generating excessive and disruptive noise within 48 hours of receipt of this notice. Failure to abate this nuisance immediately will compel the undersigned to file formal complaints with municipal code enforcement, building management, and pursue all available legal remedies, including injunctive relief and damages."
      }
    },
    "ui": {
      "title": "Neighbor Notice & Statutory Demand Generator",
      "subtitle": "Backed by Verified Acoustic Telemetry · 3 Tones · 9 Global Legal Jurisdictions",
      "toneLabel": "Communication Strategy",
      "toneHint": "Escalation Path: Friendly Reminder → Formal Negotiation → Statutory Demand",
      "toneGentle": "Gentle Friendly Reminder",
      "toneGentleDesc": "Good neighbor approach, assumes unintentional, asks for cooperative mindfulness",
      "toneFirm": "Firm Rational Negotiation",
      "toneFirmDesc": "Presents empirical exceedance data, outlines sleep disturbance and clear boundaries",
      "toneStrict": "Strict Statutory Demand",
      "toneStrictDesc": "Formal legal notice format, cites statutory codes, issues 48h cure deadline",
      "badgeFree": "Free",
      "badgePro": "🔒 PRO",
      "lblRecipient": "Recipient / Resident",
      "lblSender": "Sender / Your Name/Unit",
      "lblJurisdiction": "Legal Jurisdiction & Language",
      "scenarioLabel": "Noise Categories (Select Applicable)",
      "lblPeak": "Recorded Peak Lmax",
      "lblAvg": "Equivalent LAeq",
      "lblTime": "Monitored Window",
      "lblHash": "Audit Fingerprint",
      "articlesTitle": "Statutory Provisions & Legal Standards Cited",
      "legalHeaderTitle": "Statutory Provisions & Legal Standards Cited",
      "previewLabel": "Document Live Preview",
      "previewHint": "WYSIWYG · Formatted Legal Draft",
      "btnClose": "Close",
      "btnCopy": "Copy Text",
      "btnDocx": "Export Word (.docx)",
      "btnPdf": "Export Formatted PDF",
      "copied": "✓ Full notice copied to clipboard successfully",
      "date": "Date: ",
      "evidence": "Evidence ID: ",
      "recipientDefault": "Upstairs Neighbor",
      "senderDefault": "Downstairs Neighbor",
      "thMetric": "Acoustic Metric",
      "thValue": "Recorded Value",
      "telemetryHeader": "【Field Acoustic Telemetry Log / Evidence Summary】",
      "legalHeader": "【Statutory Provisions & Jurisdictional Standards Cited】",
      "lblSign": "Sender Signature: ",
      "lblSignDate": "Signed Date: ",
      "disclaimer": "Notice: This letter and telemetry data constitute a civilian factual documentation log for dispute resolution, not a government certification. Formal judicial actions may require certified third-party testing."
    }
  },
  "de": {
    "name": "🇩🇪 Germany / Deutschland (BGB §906 & TA Lärm)",
    "laws": [
      "Bürgerliches Gesetzbuch (BGB) § 906: Schutz vor Zuführung unwägbarer Stoffe und unzumutbaren Geräuschimmissionen von Nachbargrundstücken.",
      "Gesetz über Ordnungswidrigkeiten (OWiG) § 117: Unzulässiger Lärm, der geeignet ist, die Allgemeinheit oder die Nachbarschaft erheblich zu belästigen.",
      "Gesetzliche Nachtruhe (22:00 – 06:00 Uhr): Grundsatz der Zimmerlautstärke; laute Geräusche und Trittschall sind strikt zu vermeiden.",
      "Technische Anleitung zum Schutz gegen Lärm (TA Lärm): Immissionsrichtwerte für reine Wohngebiete nachts max. 35 dB(A)."
    ],
    "scenarios": {
      "footstep": "Lauter Trittschall / Fersengang / Herumtrampeln",
      "music": "Lauter Fernseher / dröhnende Bassvibrationen",
      "dragging": "Möbelrücken / Scharren auf hartem Boden zur Nachtzeit",
      "renovation": "Handwerkliche Arbeiten / Bohren außerhalb der Zeiten",
      "pet": "Anhaltendes Hundegebell / Haustierunruhe",
      "party": "Nächtliche Partygeräusche / laute Unterhaltungen"
    },
    "tones": {
      "gentle": {
        "title": "Freundlicher Nachbarschaftshinweis bzgl. Zimmerlautstärke",
        "body": "Liebe Nachbarn,\n\nich hoffe, es geht Ihnen gut. Ich wende mich heute mit einer freundlichen Bitte an Sie. Da unsere Geschossdecken den Schall stark übertragen, sind Geräusche wie 【{NOISE_TYPES}】 in meiner Wohnung insbesondere während der Ruhezeiten deutlich zu hören. Unsere Messungen ergaben Spitzenwerte von {PEAK} dB(A).\n\nIch gehe davon aus, dass Ihnen dies gar nicht bewusst war. Es wäre sehr nett, wenn Sie abends etwas darauf achten könnten (z. B. Hausschuhe mit weicher Sohle oder Filzgleiter unter Stühlen). Vielen Dank für Ihr Verständnis und Ihre Rücksichtnahme!"
      },
      "firm": {
        "title": "Förmliche Mitteilung über erhebliche Ruhestörung zur Nachtzeit",
        "body": "Sehr geehrte Nachbarn,\n\nich wende mich an Sie bezüglich der anhaltenden Lärmbelästigung durch 【{NOISE_TYPES}】 aus Ihrer Wohnung während der gesetzlichen Nachtruhe.\n\nObjektive Schallmessungen in meiner Wohnung belegen einen äquivalenten Dauerschallpegel (LAeq) von {LEQ} dB(A) und Spitzenwerte (Lmax) von {PEAK} dB(A). Dies übersteigt die zumutbare Zimmerlautstärke erheblich und beeinträchtigt meine Nachtruhe empfindlich.\n\nIch fordere Sie hiermit auf, die Ruhezeiten (22:00 bis 06:00 Uhr) strikt einzuhalten und geeignete Schallschutzmaßnahmen zu ergreifen. Ich hoffe auf eine einvernehmliche Lösung unter Nachbarn, bevor weitere Schritte über die Hausverwaltung erforderlich werden."
      },
      "strict": {
        "title": "FÖRMLICHE ABMAHNUNG WEGEN RUHESTÖRUNG UND UNTERLASSUNGSERKLÄRUNG",
        "body": "An: 【{RECIPIENT}】\n\nHiermit werden Sie förmlich abgemahnt. Aus Ihrer Wohnung gehen wiederholt unzumutbare und unzulässige Lärmimmissionen (【{NOISE_TYPES}】) aus, die gegen das Gebot der Zimmerlautstärke, § 906 BGB sowie § 117 OWiG verstoßen.\n\nDie messtechnische Dokumentation zwischen {TIME_RANGE} ergab einen Spitzenlärmpegel von {PEAK} dB(A) und einen LAeq von {LEQ} dB(A). Die Messdaten wurden kryptographisch mit dem SHA-256-Fingerprint {EVIDENCE_ID} fälschungssicher gesichert.\n\nIch fordere Sie hiermit ultimativ auf, die vorgenannte Ruhestörung unverzüglich, spätestens binnen 48 Stunden nach Zugang dieses Schreibens, dauerhaft einzustellen. Bei fruchtlosem Verstreichen dieser Frist werde ich unverzüglich die Hausverwaltung zur Abmahnung und Mietminderung einschalten, das Ordnungsamt hinzuziehen und zivilrechtliche Unterlassungsklage erheben."
      }
    },
    "ui": {
      "title": "Nachbarschaftsschreiben & Lärm-Abmahnungsgenerator",
      "subtitle": "Gestützt auf reale akustische Messdaten · 3 Tonalitäten · 9 Rechtsordnungen",
      "toneLabel": "Kommunikationsstrategie",
      "toneHint": "Eskalationsstufen: Freundlicher Hinweis → Sachliche Mahnung → Förmliche Abmahnung",
      "toneGentle": "Freundlicher Hinweis",
      "toneGentleDesc": "Gute Nachbarschaft, setzt Unwissenheit voraus, bittet um gegenseitige Rücksichtnahme",
      "toneFirm": "Sachliche Mahnung",
      "toneFirmDesc": "Dokumentiert Grenzwertüberschreitung, benennt Schlafstörung und klare Grenzen",
      "toneStrict": "Förmliche Abmahnung",
      "toneStrictDesc": "Rechtskonformes Abmahnschreiben, zitiert Gesetze, setzt 48h-Unterlassungsfrist",
      "lblRecipient": "Empfänger / Nachbar",
      "lblSender": "Absender / Ihre Wohnung",
      "lblJurisdiction": "Rechtsordnung & Sprache",
      "scenarioLabel": "Lärmarten (Auswahl)",
      "lblPeak": "Spitzenpegel Lmax",
      "lblAvg": "Dauerschallpegel LAeq",
      "lblTime": "Messzeitraum",
      "lblHash": "Beweis-Hash",
      "articlesTitle": "Rechtliche Grundlagen & DIN/TA-Lärm Normen",
      "previewLabel": "Live-Vorschau des Schreibens",
      "previewHint": "Automatische Formatierung · Druckfertig",
      "btnClose": "Schließen",
      "btnCopy": "Text kopieren",
      "btnDocx": "Word (.docx) exportieren",
      "btnPdf": "PDF exportieren",
      "copied": "✓ Schreiben erfolgreich in die Zwischenablage kopiert",
      "date": "Datum: ",
      "evidence": "Beweis-ID: ",
      "recipientDefault": "Liebe Nachbarn oben",
      "senderDefault": "Nachbarn unten",
      "thMetric": "Akustischer Kennwert",
      "thValue": "Messwert",
      "telemetryHeader": "【Akustisches Messprotokoll / Telemetrie-Nachweis】",
      "legalHeader": "【Zitierte Rechtsnormen und gesetzliche Grundlagen】",
      "lblSign": "Unterschrift: ",
      "lblSignDate": "Datum: ",
      "disclaimer": "Hinweis: Dieses Dokument dient der zivilrechtlichen Sachverhaltsdokumentation und gütlichen Streitbeilegung, nicht als amtliches Eichzertifikat."
    }
  },
  "fr": {
    "name": "🇫🇷 France (Code de la santé publique)",
    "laws": [
      "Code de la santé publique Art. R. 1336-5: Aucun bruit particulier ne doit, par sa durée, sa répétition ou son intensité, porter atteinte à la tranquillité du voisinage.",
      "Code civil Article 1253: Le propriétaire, locataire ou occupant qui cause à un voisin un trouble excédant les inconvénients normaux de voisinage est responsable de plein droit.",
      "Code pénal Article R. 623-2: Les bruits ou tapages nocturnes injurieux ou nocturnes troublant la tranquillité d'autrui sont punis d'amende pénale.",
      "Arrêté préfectoral de lutte contre les bruits de voisinage: Respect scrupuleux du repos nocturne entre 22h00 et 07h00."
    ],
    "scenarios": {
      "footstep": "Bruits de pas lourds / sauts / talons sur le plancher",
      "music": "Musique forte / vibrations de basses fréquences",
      "dragging": "Tirage de chaises et frottements nocturnes",
      "renovation": "Bricolage ou perçage en dehors des heures autorisées",
      "pet": "Aboiements continus ou agitation d'animaux",
      "party": "Fêtes nocturnes / cris et éclats de voix répétés"
    },
    "tones": {
      "gentle": {
        "title": "Mot amical de voisinage : Respect de la tranquillité nocturne",
        "body": "Chers voisins,\n\nJ'espère que vous allez bien. Je me permets de vous laisser ce petit mot amical. En raison de l'isolation phonique de l'immeuble, les bruits de type 【{NOISE_TYPES}】 résonnent particulièrement chez moi en soirée et la nuit, avec des pointes mesurées à {PEAK} dB(A).\n\nJe me doute bien que vous ne vous en rendez pas compte et qu'il n'y a aucune mauvaise intention. Serait-il possible de faire attention durant les heures de repos (par exemple avec des patins en feutre ou des chaussons souples) ? Merci beaucoup pour votre compréhension et bonne journée !"
      },
      "firm": {
        "title": "Courrier formel concernant des nuisances sonores répétées",
        "body": "Madame, Monsieur,\n\nJe vous adresse ce courrier afin de vous faire part de la persistance de nuisances sonores provenant de votre logement, notamment 【{NOISE_TYPES}】 en période nocturne.\n\nLes relevés acoustiques effectués attestent d'un niveau équivalent (LAeq) de {LEQ} dB(A) et d'un niveau crête (Lmax) atteignant {PEAK} dB(A), ce qui dépasse largement le niveau acceptable en milieu résidentiel et trouble gravement notre sommeil.\n\nJe vous demande de bien vouloir prendre les dispositions nécessaires pour respecter la tranquillité nocturne entre 22h00 et 07h00. J'espère vivement que nous pourrons régler ce problème à l'amiable sans avoir à saisir le syndic de copropriété."
      },
      "strict": {
        "title": "MISE EN DEMEURE POUR TROUBLE ANORMAL DE VOISINAGE ET TAPAGE",
        "body": "À l'attention de: 【{RECIPIENT}】\n\nPar la présente, vous êtes formellement mis en demeure de cesser les nuisances sonores excessives et répétées (【{NOISE_TYPES}】) émanant de votre domicile, constitutives de troubles anormaux de voisinage au sens de l'article 1253 du Code civil et de l'article R. 1336-5 du Code de la santé publique.\n\nLes enregistrements acoustiques horodatés et scellés par empreinte SHA-256 {EVIDENCE_ID} attestent d'un niveau de crête de {PEAK} dB(A) et d'une moyenne de {LEQ} dB(A) durant la plage horaire {TIME_RANGE}.\n\nJe vous somme de mettre un terme définitif à ces nuisances sous 48 heures à compter de la réception de cette notification. À défaut, je saisirai sans autre préavis le syndic de copropriété, les services de police pour tapage nocturne et engagerai une procédure judiciaire."
      }
    },
    "ui": {
      "title": "Générateur de Courrier de Voisinage & Mise en Demeure",
      "subtitle": "Basé sur des mesures acoustiques certifiées · 3 tonalités · 9 juridictions",
      "toneLabel": "Stratégie de communication",
      "toneHint": "Démarche progressive: Courrier amical → Avis formel → Mise en demeure",
      "toneGentle": "Courrier amical",
      "toneGentleDesc": "Bonne entente de voisinage, présume la bonne foi, sollicite la bienveillance",
      "toneFirm": "Avis formel",
      "toneFirmDesc": "Présente les dépassements sonores réels, souligne l'impact sur le sommeil",
      "toneStrict": "Mise en demeure",
      "toneStrictDesc": "Format juridique rigoureux, cite le Code civil et santé publique, délai de 48h",
      "lblRecipient": "Destinataire / Voisin",
      "lblSender": "Expéditeur / Votre logement",
      "lblJurisdiction": "Juridiction & Langue",
      "scenarioLabel": "Type de nuisances (Sélection)",
      "lblPeak": "Niveau Crête Lmax",
      "lblAvg": "Moyenne LAeq",
      "lblTime": "Plage horaire",
      "lblHash": "Empreinte SHA-256",
      "articlesTitle": "Dispositions Légales et Textes de Référence",
      "previewLabel": "Aperçu du courrier en direct",
      "previewHint": "Mise en page automatique · Prêt à imprimer",
      "btnClose": "Fermer",
      "btnCopy": "Copier le texte",
      "btnDocx": "Exporter Word (.docx)",
      "btnPdf": "Exporter en PDF",
      "copied": "✓ Courrier copié dans le presse-papiers avec succès",
      "date": "Date : ",
      "evidence": "Réf. preuve : ",
      "recipientDefault": "Chers voisins du dessus",
      "senderDefault": "Voisins du dessous",
      "thMetric": "Indicateur acoustique",
      "thValue": "Valeur mesurée",
      "telemetryHeader": "【Relevé Acoustique Horodaté / Registre de Télémétrie】",
      "legalHeader": "【Fondements Juridiques et Textes Applicables】",
      "lblSign": "Signature de l'expéditeur : ",
      "lblSignDate": "Date : ",
      "disclaimer": "Note : Ce document constitue un relevé factuel privé d'aide à la médiation et résolution de litiges, sans valeur de métrologie légale d'État."
    }
  },
  "es": {
    "name": "🇪🇸 Spain / España (Ley del Ruido)",
    "laws": [
      "Ley 37/2003 del Ruido: Regula la prevención, vigilancia y reducción de la contaminación acústica para evitar daños en la salud humana y bienes.",
      "Código Civil Artículos 1902 y 590: Responsabilidad extracontractual por daño y deber de no causar inmisiones perjudiciales a fundos vecinos.",
      "Ley de Propiedad Horizontal (LPH) Artículo 7.2: Al propietario y al ocupante del piso no les está permitido desarrollar actividades molestas o insalubres.",
      "Ordenanza Municipal de Protección contra la Contaminación Acústica: Horario de descanso nocturno fijado entre las 22:00 y las 08:00 horas."
    ],
    "scenarios": {
      "footstep": "Pisar fuerte, taconeo continuo o carreras infantiles",
      "music": "Televisión a volumen excesivo o vibración de graves",
      "dragging": "Arrastre de muebles o sillas de madrugada",
      "renovation": "Obras, taladros o martillazos fuera de horario",
      "pet": "Ladridos continuados o ruidos de mascotas",
      "party": "Fiestas nocturnas, gritos o música estridente"
    },
    "tones": {
      "gentle": {
        "title": "Nota amistosa de vecindad: Ruidos y descanso nocturno",
        "body": "Estimado/a vecino/a:\n\nEspero que se encuentre bien. Le escribo esta breve nota cordial para comentarle que, debido al aislamiento acústico del edificio, ruidos como 【{NOISE_TYPES}】 se escuchan con bastante claridad en mi vivienda durante la noche, alcanzando picos medidos de {PEAK} dB(A).\n\nEntiendo perfectamente que no lo hace con mala intención y que muchas veces uno no es consciente de cómo viaja el sonido. Le agradecería mucho si pudiera tener un poco de cuidado en horas de descanso (por ejemplo, usando zapatillas de suela blanda o almohadillas en las sillas). ¡Muchas gracias por su comprensión y buena vecindad!"
      },
      "firm": {
        "title": "Comunicación formal sobre ruidos excesivos en horario de descanso",
        "body": "Estimado/a vecino/a:\n\nMe dirijo a usted de manera formal para manifestarle mi preocupación por los continuos ruidos procedentes de su vivienda (【{NOISE_TYPES}】) en horario nocturno.\n\nLas mediciones acústicas realizadas registran un nivel continuo equivalente (LAeq) de {LEQ} dB(A) y un valor máximo (Lmax) de {PEAK} dB(A), superando ostensiblemente los límites permitidos para zonas residenciales y afectando seriamente nuestro descanso.\n\nLe solicito que adopte las medidas oportunas para amortiguar estas molestias entre las 22:00 y las 08:00 horas. Confío en que podamos solucionar este inconveniente de forma amistosa sin tener que dar traslado al Administrador de la Comunidad."
      },
      "strict": {
        "title": "REQUERIMIENTO FORMAL DE CESACIÓN DE INMISIÓN SONORA Y RUIDOS MOLESTOS",
        "body": "Al ocupante de la vivienda: 【{RECIPIENT}】\n\nPor medio del presente escrito se le REQUIERE FORMALMENTE para que proceda a la CESACIÓN INMEDIATA de los ruidos molestos y excesivos (【{NOISE_TYPES}】) procedentes de su inmueble, los cuales vulneran el art. 7.2 de la Ley de Propiedad Horizontal y la Ley del Ruido 37/2003.\n\nEl registro acústico pericial acreditado mediante firma digital SHA-256 {EVIDENCE_ID} evidencia picos sonoros de {PEAK} dB(A) y promedios de {LEQ} dB(A) en horario nocturno {TIME_RANGE}.\n\nDispone de un plazo improrrogable de 48 HORAS desde la recepción de la presente para cesar dichas perturbaciones. En caso contrario, se interpondrá denuncia ante la Policía Local y se ejercerán las acciones civiles oportunas de cesación e indemnización."
      }
    },
    "ui": {
      "title": "Generador de Notificación Vecinal y Requerimiento Legal",
      "subtitle": "Basado en telemetría acústica verificada · 3 tonos · 9 jurisdicciones legales",
      "toneLabel": "Estrategia de comunicación",
      "toneHint": "Escalado progresivo: Nota cordial → Comunicación formal → Requerimiento legal",
      "toneGentle": "Nota cordial amistosa",
      "toneGentleDesc": "Buena vecindad, asume falta de conocimiento, solicita empatía y cuidado mutuo",
      "toneFirm": "Comunicación formal",
      "toneFirmDesc": "Aporta datos objetivos de exceso de decibelios, señala afectación al descanso",
      "toneStrict": "Requerimiento legal",
      "toneStrictDesc": "Formato de burofax/carta de cese, cita preceptos legales, concede plazo de 48h",
      "lblRecipient": "Destinatario / Vecino",
      "lblSender": "Remitente / Su vivienda",
      "lblJurisdiction": "Jurisdicción e Idioma",
      "scenarioLabel": "Tipo de ruidos (Selección rápida)",
      "lblPeak": "Pico medido Lmax",
      "lblAvg": "Equivalente LAeq",
      "lblTime": "Tramo horario",
      "lblHash": "Firma digital",
      "articlesTitle": "Fundamentos de Derecho y Normativa Acústica",
      "previewLabel": "Vista previa en directo del escrito",
      "previewHint": "Formato legal estructurado · Listo para imprimir",
      "btnClose": "Cerrar",
      "btnCopy": "Copiar texto",
      "btnDocx": "Exportar Word (.docx)",
      "btnPdf": "Exportar en PDF",
      "copied": "✓ Escrito copiado al portapapeles con éxito",
      "date": "Fecha: ",
      "evidence": "Nº Evidencia: ",
      "recipientDefault": "Estimados vecinos de arriba",
      "senderDefault": "Vecinos de abajo",
      "thMetric": "Parámetro acústico",
      "thValue": "Lectura registrada",
      "telemetryHeader": "【Registro Pericial de Telemetría Acústica / Evidencias】",
      "legalHeader": "【Artículos Legales y Fundamentos de Derecho Citados】",
      "lblSign": "Firma del requirente: ",
      "lblSignDate": "Fecha: ",
      "disclaimer": "Nota: Este documento constituye un registro factual de parte para resolución de disputas, no un certificado oficial de metrología estatal."
    }
  },
  "ja": {
    "name": "🇯🇵 日本 (民法相隣関係 & 受忍限度論)",
    "laws": [
      "民法 第209条・第709条: 相隣関係および不法行為に基づく損害賠償・妨害排除（差止）請求権。",
      "裁判所判例法理における「受忍限度論」: 社会通念上受忍すべき限度を超える騒音は違法と認定され、損害賠償義務が発生します。",
      "環境省告示・騒音に係る環境基準: 住宅地域における夜間（午後10時～午前6時）の指針値は 45 dB(A) 以下。",
      "マンション標準管理規約 第18条: 区分所有者等は、共同の利益に反する行為または生活平穏を著しく害する行為をしてはならない。"
    ],
    "scenarios": {
      "footstep": "足音・踵歩きの衝撃音・室内での走り回り",
      "music": "大音量のテレビ・スピーカーの低音振動",
      "dragging": "深夜の家具の引きずり音や硬質物の落下音",
      "renovation": "規約時間外のDIY・日曜大工・打撃音",
      "pet": "ペットの継続的な鳴き声や走り回り",
      "party": "深夜の宴会・大声での会話・騒ぎ"
    },
    "tones": {
      "gentle": {
        "title": "ご近所のお願い：夜間の生活音について",
        "body": "上階の皆様へ\n\n日頃より大変お世話になっております。突然のお手紙で恐れ入ります。\n当マンションの構造上、夜間の静かな時間帯におきまして、【{NOISE_TYPES}】などの音が下階に響きやすく、測定値で最大 {PEAK} dB(A) の数値を記録しております。\n\n故意ではないことは重々承知しており、大変申し上げにくいのですが、夜間のお時間帯におきましてスリッパの着用や椅子の脚カバーなど、少しご配慮をいただけますと大変助かります。集合住宅でのお互いの快適な生活のため、何卒ご理解のほどよろしくお願い申し上げます。"
      },
      "firm": {
        "title": "夜間生活騒音の改善に関する申入書",
        "body": "拝啓\n貴殿におかれましては、平素よりお世話になっております。\nさて、貴殿居室より発生する夜間の【{NOISE_TYPES}】につきまして、再三にわたり生活上の大きな支障となっておりますため、本書面を以て正式に申し入れをさせていただきます。\n\n当方居室内における客観的音響測定の結果、等価騒音レベル(LAeq)は {LEQ} dB(A)、最大騒音レベル(Lmax)は {PEAK} dB(A) に達しており、一般的な住宅地の夜間受忍基準を大幅に超過しております。\n夜間（22:00～翌7:00）の静穏確保に向け、早急な防音・消音措置を講じていただけますようお願いいたします。管理組合や管理会社への相談に至る前に、両者間での円満な改善を強く希望いたします。"
      },
      "strict": {
        "title": "生活平穏権侵害に対する騒音差止請求及び警告通知書",
        "body": "居室占有者 【{RECIPIENT}】 殿\n\n本書面を以て、貴殿居室より恒常的・継続的に発生している夜間騒音（【{NOISE_TYPES}】）について厳重に抗議し、直ちにその行為を停止することを請求（差止請求）いたします。\n\n客観的音響データ計測に基づき、最大音圧 {PEAK} dB(A)、平均等価音圧 {LEQ} dB(A) の違法な騒音が立証されており、改ざん防止ハッシュ（SHA-256: {EVIDENCE_ID}）により証拠保全されております。貴殿の行為は社会通念上の「受忍限度」を明白に逸脱し、不法行為（民法第709条）を構成します。\n\n本書受領後48時間以内に騒音発生を完全に停止されない場合、当方は警察への通報、管理組合への報告、ならびに民事妨害排除請求訴訟および慰謝料請求の法的措置を講じる所存です。"
      }
    },
    "ui": {
      "title": "近隣騒音申入書・警告通知書ジェネレーター",
      "subtitle": "実測音響データに基づく証拠化 · 3段階の口調 · 主要9法域の法令条文を自動引用",
      "toneLabel": "コミュニケーション戦略（トーン選択）",
      "toneHint": "段階的対応：穏やかなお願い → 正式な申入書 → 法的警告書",
      "toneGentle": "穏やかなお願い",
      "toneGentleDesc": "円満な関係を重視、無意識を前提とし、互いの配慮を呼びかける",
      "toneFirm": "正式な申入書",
      "toneFirmDesc": "客観的な超過数値を提示し、睡眠への影響と境界線を明確に示す",
      "toneStrict": "法的警告通知書",
      "toneStrictDesc": "受忍限度論・民法不法行為条文を引用し、48時間以内の改善を求める",
      "lblRecipient": "受取人 / お相手の居室",
      "lblSender": "差出人 / あなたの居室",
      "lblJurisdiction": "準拠法域・言語選択",
      "scenarioLabel": "発生している騒音の種類（選択）",
      "lblPeak": "実測最大音圧 Lmax",
      "lblAvg": "等価騒音レベル LAeq",
      "lblTime": "測定時間帯",
      "lblHash": "防改ざんハッシュ",
      "articlesTitle": "引用法令・判例法理・環境基準条文",
      "previewLabel": "書面リアルタイムプレビュー",
      "previewHint": "自動組版 · 印刷・提出対応",
      "btnClose": "閉じる",
      "btnCopy": "本文をコピー",
      "btnDocx": "Word (.docx) 出力",
      "btnPdf": "PDF 出力",
      "copied": "✓ 書面全文をクリップボードにコピーしました",
      "date": "作成日: ",
      "evidence": "証拠番号: ",
      "recipientDefault": "上階の皆様へ",
      "senderDefault": "下階居住者",
      "thMetric": "測定項目 (Acoustic Metric)",
      "thValue": "実測値 (Recorded Value)",
      "telemetryHeader": "【現場音響計測データ証拠記録表 / Telemetry Log】",
      "legalHeader": "【法的根拠条文・受忍限度規範 / Legal Grounds】",
      "lblSign": "通知人署名: ",
      "lblSignDate": "日付: ",
      "disclaimer": "注：本書面および添付音響データは民事上の事実関係記録であり、国家計量検定証明書ではありません。裁判上の手続きには指定検査機関の報告書が推奨されます。"
    }
  },
  "ko": {
    "name": "🇰🇷 대한민국 (공동주택관리법 & 층간소음 기준)",
    "laws": [
      "공동주택관리법 제20조 (층간소음의 방지 등): 입주자등은 공동주택에서 층간소음으로 인하여 다른 입주자등에게 피해를 주지 아니하도록 노력하여야 한다.",
      "공동주택 층간소음의 범위와 기준에 관한 규칙: 야간 직접충격 1분 등가소음도 34 dB(A), 최고소음도 52 dB(A) 초과 시 위법성 인정.",
      "민법 제217조 (매연등에 의한 인접토지에 대한 방해금지) 및 제750조 (불법행위의 내용): 타인의 생활평온을 해치는 소음은 불법행위로서 손해배상 책임의 대상입니다.",
      "환경분쟁조정법: 수인한도를 초과하는 층간소음에 대한 정신적 피해 배상 기준 규정."
    ],
    "scenarios": {
      "footstep": "발망치 / 쿵쿵거리는 발걸음 / 아이들 뛰는 소리",
      "music": "심야 TV 고음량 / 스피커 우퍼 진동",
      "dragging": "야간 의자 및 가구 끄는 소리 / 긁는 소리",
      "renovation": "심야 또는 규정 시간 외 인테리어 / 타격 소음",
      "pet": "반려견의 짖는 소리 및 뛰어다니는 진동",
      "party": "심야 음주 파티 / 고성방가 및 말다툼"
    },
    "tones": {
      "gentle": {
        "title": "이웃 간 정중한 부탁의 글 (층간소음 관련)",
        "body": "이웃 주민분께,\n\n안녕하세요. 같은 건물에 거주하는 이웃입니다. 조심스럽게 부탁의 말씀을 드리고자 메모를 남깁니다.\n건물 구조상 야간 휴식 시간에 【{NOISE_TYPES}】 소리가 실내로 울려 수면에 다소 어려움을 겪고 있으며, 측정된 순간 소음은 {PEAK} dB(A)에 이르고 있습니다.\n\n일부러 그러신 것이 아님을 잘 알고 있습니다. 밤 시간대 실내 슬리퍼 착용이나 의자 다리 소음 방지 패드 부착 등 조금만 신경 써주시면 더없이 감사하겠습니다. 평온한 이웃 생활을 위해 양해 부탁드립니다."
      },
      "firm": {
        "title": "야간 층간소음 기준 초과에 따른 공식 협의 요청서",
        "body": "입주자 귀하,\n\n귀 댁에서 지속적으로 발생하는 야간 【{NOISE_TYPES}】으로 인하여 당 가정의 일상생활 및 수면권이 심각하게 침해받고 있어 정식으로 개선을 요청드립니다.\n\n당사 세대 내에서 객관적으로 계측된 소음 데이터에 따르면, 야간 등가소음도(LAeq)는 {LEQ} dB(A), 최고소음도(Lmax)는 {PEAK} dB(A)를 기록하여 환경부 공동주택 층간소음 기준을 상회하고 있습니다.\n\n공동주택관리법에 부합하는 소음 저감 조치를 조속히 이행해 주시기 바라며, 관리사무소 중재나 분쟁조정위원회 접수 이전에 자율적으로 원만히 해결되기를 기대합니다."
      },
      "strict": {
        "title": "층간소음 침해 행위 중지 청구 및 법적 대응 사전 통고서",
        "body": "입주자 【{RECIPIENT}】 귀하,\n\n본 서면을 통하여 귀하의 세대에서 발생하는 수인한도 초과 층간소음(【{NOISE_TYPES}】)에 대하여 즉각적인 침해 중지를 엄중히 최고(催告)합니다.\n\nSOUNDTEST.PRO 측정 시스템에 의해 시간대별 소음도 및 무결성 검증값(SHA-256: {EVIDENCE_ID})으로 박차된 증거에 의하면, 야간 최고소음도 {PEAK} dB(A), 평균 {LEQ} dB(A)로 민법 제750조 및 공동주택관리법 제20조가 정한 수인한도를 명백히 초과하였습니다.\n\n본 통고서 수령 후 48시간 이내에 층간소음 유발 행위를 즉시 전면 중단할 것을 요구합니다. 불응 시 관리사무소 통보, 경찰 신고 및 환경분쟁조정위원회 신청, 민사상 손해배상 청구 소송을 즉각 제기할 것임을 통고합니다."
      }
    },
    "ui": {
      "title": "층간소음 이웃 소통문 및 법적 통고서 생성기",
      "subtitle": "실측 음향 데이터 기반 검증 · 3단계 어조 · 9개국 법적 기준 자동 인용",
      "toneLabel": "소통 어조 전략",
      "toneHint": "단계별 대응: 정중한 부탁 → 공식 협의 요청 → 법적 통고서",
      "toneGentle": "정중한 부탁",
      "toneGentleDesc": "원만한 이웃 관계 우선, 부지불식간 발생 전제, 상호 배려 요청",
      "toneFirm": "공식 협의 요청",
      "toneFirmDesc": "객관적 기준 초과 수치 제시, 수면 방해 사실과 명확한 기준선 통보",
      "toneStrict": "법적 통고서",
      "toneStrictDesc": "정식 내용증명 형식, 민법 및 층간소음 규칙 인용, 48시간 시정 요구",
      "lblRecipient": "수신인 / 해당 세대",
      "lblSender": "발신인 / 귀하 세대",
      "lblJurisdiction": "준거 법역 및 언어",
      "scenarioLabel": "발생 소음 유형 (선택)",
      "lblPeak": "실측 최고소음 Lmax",
      "lblAvg": "등가소음 LAeq",
      "lblTime": "측정 시간대",
      "lblHash": "위변조 방지 해시",
      "articlesTitle": "관련 법령 및 층간소음 법적 기준",
      "previewLabel": "서면 실시간 미리보기",
      "previewHint": "자동 조판 · 인쇄 및 제출 가능",
      "btnClose": "닫기",
      "btnCopy": "본문 복사",
      "btnDocx": "Word (.docx) 내보내기",
      "btnPdf": "PDF 내보내기",
      "copied": "✓ 서면 전문이 클립보드에 복사되었습니다",
      "date": "작성일자: ",
      "evidence": "증거번호: ",
      "recipientDefault": "이웃 주민분께",
      "senderDefault": "이웃 세대",
      "thMetric": "음향 측정 지표 (Acoustic Metric)",
      "thValue": "실측 수치 (Recorded Value)",
      "telemetryHeader": "【현장 음향 계측 데이터 증거 기록표 / Telemetry Log】",
      "legalHeader": "【법적 근거 조항 및 준거 규정 / Legal Grounds】",
      "lblSign": "통지인 서명: ",
      "lblSignDate": "일자: ",
      "disclaimer": "안내: 본 서면 및 첨부된 음향 데이터는 민사적 사실 확인 기록이며 국가 법정 계량 검정 증명서가 아닙니다."
    }
  },
  "th": {
    "name": "🇹🇭 ประเทศไทย (พ.ร.บ.การสาธารณสุข)",
    "laws": [
      "พระราชบัญญัติการสาธารณสุข พ.ศ. 2535 (มาตรา 25 และมาตรา 28): การกระทำใดๆ อันเป็นเหตุให้เกิดกลิ่น แสง รังสี เสียง ความสั่นสะเทือน จนเป็นเหตุให้เสื่อมหรืออาจเป็นอันตรายต่อสุขภาพ ถือเป็นเหตุรำคาญ.",
      "ประมวลกฎหมายแพ่งและพาณิชย์ มาตรา 420: ผู้ใดจงใจหรือประมาทเลินเล่อทำต่อบุคคลอื่นโดยผิดกฎหมาย เป็นเหตุให้เขาเสียหายแก่ร่างกาย อนามัย หรือเสรีภาพ ผู้นั้นต้องชดใช้ค่าสินไหมทดแทน.",
      "ประมวลกฎหมายแพ่งและพาณิชย์ มาตรา 1337: บุคคลใดใช้สิทธิของตนเป็นเหตุให้เจ้าของอสังหาริมทรัพย์ได้รับความเสียหายหรือเดือดร้อนเกินที่ควรคิดหรือคาดหมายได้ มีสิทธิปฏิบัติการเพื่อยังความเสียหายนั้นให้สิ้นไป.",
      "ประกาศกรมควบคุมมลพิษ เรื่อง กำหนดระดับเสียงรบกวน: เกณฑ์มาตรฐานระดับเสียงรบกวนในอาคารพักอาศัย."
    ],
    "scenarios": {
      "footstep": "เสียงเดินลงส้นเท้า / เสียงวิ่ง / กระโดดกระแทกพื้น",
      "music": "เสียงโทรทัศน์ดัง / เสียงเบสสะเทือนผนัง",
      "dragging": "เสียงลากเก้าอี้และสิ่งของบนพื้นยามวิกาล",
      "renovation": "การเจาะ ต่อเติม หรือซ่อมแซมเสียงดังนอกเวลา",
      "pet": "เสียงสุนัขเห่าหรือสัตว์เลี้ยงวิ่งรบกวนต่อเนื่อง",
      "party": "งานสังสรรค์เสียงดัง / พูดคุยเสียงดังยามวิกาล"
    },
    "tones": {
      "gentle": {
        "title": "ข้อความเพื่อความเข้าใจอันดีระหว่างเพื่อนบ้าน : เรื่องเสียงรบกวนยามวิกาล",
        "body": "เรียน เพื่อนบ้านที่เคารพ,\n\nขออนุญาตส่งข้อความสั้นๆ นี้ด้วยความปรารถนาดีครับ เนื่องจากโครงสร้างอาคารส่งผ่านเสียงได้ง่าย ในช่วงเวลาพักผ่อนตอนกลางคืน เสียงประเภท 【{NOISE_TYPES}】 ส่งผลกระทบต่อการนอนหลับ โดยวัดระดับเสียงสูงสุดได้ถึง {PEAK} dB(A)\n\nเข้าใจเป็นอย่างยิ่งว่าท่านมิได้มีเจตนาและอาจไม่ทราบเรื่อง จึงใคร่ขอความอนุเคราะห์ช่วยลดเสียงในยามวิกาล เช่น สวมรองเท้าเดินในบ้านแบบนุ่ม หรือติดแผ่นซับเสียงที่ขาเก้าอี้ ขอขอบพระคุณในความเข้าใจและมิตรภาพอันดีครับ"
      },
      "firm": {
        "title": "หนังสือแจ้งความประสงค์อย่างเป็นทางการเรื่องเสียงรบกวนยามวิกาล",
        "body": "เรียน ผู้พักอาศัย,\n\nขอแจ้งให้ทราบถึงปัญหาเสียงรบกวนจากห้องของท่าน ได้แก่ 【{NOISE_TYPES}】 ในช่วงเวลาค่ำคืนอย่างต่อเนื่อง ซึ่งส่งผลกระทบต่อสุขอนามัยและการพักผ่อนอย่างร้ายแรง\n\nจากการตรวจวัดระดับเสียงอย่างเป็นรูปธรรม พบว่าระดับเสียงเฉลี่ย (LAeq) อยู่ที่ {LEQ} dB(A) และระดับเสียงสูงสุด (Lmax) สูงถึง {PEAK} dB(A) ซึ่งเกินกว่าระดับปกติของที่พักอาศัย\n\nขอความกรุณาจัดการแก้ไขและลดเสียงรบกวนดังกล่าวในช่วงเวลา 22.00 - 07.00 น. โดยหวังเป็นอย่างยิ่งว่าจะสามารถแก้ไขปัญหาร่วมกันได้โดยมิต้องแจ้งนิติบุคคลอาคารชุด"
      },
      "strict": {
        "title": "หนังสือบอกกล่าวทวงถามให้ระงับเหตุรำคาญทางเสียงและแจ้งสิทธิตามกฎหมาย",
        "body": "เรียน ผู้พักอาศัย / เจ้าของห้องชุด: 【{RECIPIENT}】\n\nหนังสือฉบับนี้เป็นการบอกกล่าวอย่างเป็นทางการ ขอให้ท่านยุติการกระทำอันก่อให้เกิดเสียงดังรบกวนเกินควร (【{NOISE_TYPES}】) ซึ่งถือเป็นเหตุรำคาญตามพระราชบัญญัติการสาธารณสุข พ.ศ. 2535 และเป็นการละเมิดสิทธิผู้อื่นตามประมวลกฎหมายแพ่งและพาณิชย์ มาตรา 420 และ 1337\n\nข้อมูลเสียงที่บันทึกไว้ได้รับการตรวจสอบความถูกต้องด้วยรหัส SHA-256: {EVIDENCE_ID} ระดับเสียงสูงสุด {PEAK} dB(A) และเฉลี่ย {LEQ} dB(A) ในช่วงเวลา {TIME_RANGE}\n\nขอให้ท่านระงับเหตุรำคาญดังกล่าวโดยเด็ดขาดภายใน 48 ชั่วโมง หากพ้นกำหนด ข้าพเจ้าจำเป็นต้องยื่นเรื่องต่อนิติบุคคล แจ้งเจ้าพนักงานท้องถิ่น และดำเนินคดีทางแพ่งเพื่อเรียกค่าเสียหายต่อไป"
      }
    },
    "ui": {
      "title": "ระบบสร้างหนังสือแจ้งเพื่อนบ้านและบอกกล่าวทางกฎหมาย",
      "subtitle": "อ้างอิงข้อมูลตรวจวัดเสียงจริง · 3 ระดับน้ำเสียง · อ้างอิงบทบัญญัติกฎหมาย 9 ประเทศ",
      "toneLabel": "กลยุทธ์ระดับน้ำเสียง",
      "toneHint": "ลำดับขั้นการสื่อสาร: ขอความร่วมมืออย่างสุภาพ → หนังสือแจ้งเป็นทางการ → หนังสือบอกกล่าวทางกฎหมาย",
      "toneGentle": "ขอความร่วมมืออย่างสุภาพ",
      "toneGentleDesc": "รักษามิตรภาพเพื่อนบ้าน สันนิษฐานว่ามิได้ตั้งใจ ขอความเห็นอกเห็นใจ",
      "toneFirm": "หนังสือแจ้งเป็นทางการ",
      "toneFirmDesc": "แสดงข้อมูลตัวเลขระดับเสียงชัดเจน ชี้แจงผลกระทบต่อการพักผ่อน",
      "toneStrict": "หนังสือบอกกล่าวทางกฎหมาย",
      "toneStrictDesc": "รูปแบบหนังสือโนติสเป็นทางการ อ้างกฎหมายสาธารณสุขและละเมิด ให้เวลาแก้ไข 48 ชม.",
      "lblRecipient": "ผู้รับ / ห้องชุด",
      "lblSender": "ผู้ส่ง / ห้องชุดของท่าน",
      "lblJurisdiction": "เขตอำนาจศาลและภาษา",
      "scenarioLabel": "ประเภทเสียงรบกวน (เลือก)",
      "lblPeak": "ระดับเสียงสูงสุด Lmax",
      "lblAvg": "ระดับเสียงเฉลี่ย LAeq",
      "lblTime": "ช่วงเวลาตรวจวัด",
      "lblHash": "รหัสตรวจสอบความถูกต้อง",
      "articlesTitle": "บทบัญญัติทางกฎหมายและเกณฑ์มาตรฐานที่อ้างอิง",
      "previewLabel": "ตัวอย่างหนังสือแบบเรียลไทม์",
      "previewHint": "จัดรูปแบบอัตโนมัติ · พร้อมพิมพ์ใช้งาน",
      "btnClose": "ปิด",
      "btnCopy": "คัดลอกข้อความ",
      "btnDocx": "ส่งออกเป็น Word (.docx)",
      "btnPdf": "ส่งออกเป็น PDF",
      "copied": "✓ คัดลอกข้อความหนังสือเรียบร้อยแล้ว",
      "date": "วันที่: ",
      "evidence": "รหัสหลักฐาน: ",
      "recipientDefault": "เรียน เพื่อนบ้านห้องด้านบน",
      "senderDefault": "เพื่อนบ้านห้องด้านล่าง",
      "thMetric": "ดัชนีชี้วัดทางเสียง",
      "thValue": "ค่าที่ตรวจวัดได้",
      "telemetryHeader": "【ตารางบันทึกข้อมูลหลักฐานทางเสียง / Telemetry Log】",
      "legalHeader": "【บทบัญญัติกฎหมายและหลักเกณฑ์ที่เกี่ยวข้อง】",
      "lblSign": "ลงชื่อผู้แจ้ง: ",
      "lblSignDate": "วันที่: ",
      "disclaimer": "หมายเหตุ: เอกสารฉบับนี้เป็นบันทึกข้อเท็จจริงเพื่อการเจรจาระงับข้อพิพาท มิใช่หนังสือรับรองทางมาตรวิทยาของรัฐ"
    }
  },
  "vi": {
    "name": "🇻🇳 Việt Nam (Bộ luật Dân sự 2015 & QCVN 26)",
    "laws": [
      "Bộ luật Dân sự 2015, Điều 172: Nghĩa vụ của chủ sở hữu trong việc thực hiện quyền sở hữu không được gây thiệt hại hoặc làm ảnh hưởng đến quyền, lợi ích hợp pháp của người khác.",
      "Bộ luật Dân sự 2015, Điều 605: Bồi thường thiệt hại do vi phạm quy tắc láng giềng và trật tự xây dựng, sinh hoạt.",
      "Nghị định 45/2022/NĐ-CP: Quy định về xử phạt vi phạm hành chính trong lĩnh vực bảo vệ môi trường đối với hành vi gây tiếng ồn vượt quy chuẩn kỹ thuật.",
      "Quy chuẩn kỹ thuật quốc gia QCVN 26:2010/BTNMT về tiếng ồn: Giới hạn tối đa cho phép tại khu vực thông thường từ 21h đến 6h sáng là 45 dBA."
    ],
    "scenarios": {
      "footstep": "Tiếng bước chân huỳnh huỵch / gót chân / chạy nhảy",
      "music": "Tiếng tivi quá lớn / loa siêu trầm rung tường",
      "dragging": "Kéo lê bàn ghế, đồ đạc trên sàn đêm muộn",
      "renovation": "Khoan đục, sửa chữa ngoài giờ quy định",
      "pet": "Chó sủa kéo dài hoặc thú cưng chạy nhảy",
      "party": "Tụ tập ăn nhậu / la hét ồn ào đêm khuya"
    },
    "tones": {
      "gentle": {
        "title": "Thư ngỏ thân thiện giữa láng giềng : Về tiếng ồn trong giờ nghỉ ngơi",
        "body": "Kính gửi Anh/Chị láng giềng,\n\nTôi xin phép gửi lời chào thân thiện đến Anh/Chị. Do kết cấu cách âm của tòa nhà còn hạn chế, trong khung giờ nghỉ ngơi buổi tối, âm thanh như 【{NOISE_TYPES}】 truyền xuống khá rõ, máy đo ghi nhận mức đỉnh đạt {PEAK} dB(A), gây ảnh hưởng đến giấc ngủ của gia đình tôi.\n\nTôi hiểu rằng Anh/Chị không cố ý và có thể không nhận biết được việc âm thanh bị dội xuống. Rất mong Anh/Chị lưu tâm giảm bớt tiếng ồn vào ban đêm (ví dụ: đi dép bông êm hoặc dán đệm chân bàn ghế). Chân thành cảm ơn sự thấu hiểu và tình làng nghĩa xóm của Anh/Chị!"
      },
      "firm": {
        "title": "Thư trao đổi chính thức về việc tiếng ồn sinh hoạt ban đêm vượt ngưỡng",
        "body": "Kính gửi Anh/Chị,\n\nTôi gửi thư này để chính thức phản ánh về tình trạng tiếng ồn từ căn hộ của Anh/Chị (【{NOISE_TYPES}】) tiếp tục tái diễn trong giờ nghỉ ngơi ban đêm.\n\nDữ liệu đo đạc thực tế ghi nhận mức ồn tương đương (LAeq) là {LEQ} dB(A) và mức ồn đỉnh (Lmax) lên tới {PEAK} dB(A), vượt quá tiêu chuẩn môi trường âm thanh khu dân cư ban đêm và ảnh hưởng nghiêm trọng đến sức khỏe của chúng tôi.\n\nKính đề nghị Anh/Chị có biện pháp kiểm soát tiếng ồn từ 22h00 đến 07h00 sáng. Rất mong vấn đề được giải quyết êm đẹp giữa các hộ dân trước khi phải chuyển lên Ban Quản lý tòa nhà."
      },
      "strict": {
        "title": "THƯ YÊU CẦU CHẤM DỨT HÀNH VI GÂY TIẾNG ỒN VÀ THÔNG BÁO PHÁP LÝ",
        "body": "Kính gửi Người cư trú / Chủ căn hộ: 【{RECIPIENT}】\n\nBằng văn bản này, tôi yêu cầu Anh/Chị CHẤM DỨT NGAY hành vi gây tiếng ồn quá mức (【{NOISE_TYPES}】) từ căn hộ của mình, vi phạm trật tự công cộng và quy định tại Điều 172 Bộ luật Dân sự 2015 cũng như Quy chuẩn tiếng ồn QCVN 26:2010/BTNMT.\n\nChứng cứ âm thanh đã được xác thực mã hóa kỹ thuật số SHA-256: {EVIDENCE_ID}, với mức ồn đỉnh {PEAK} dB(A) và trung bình {LEQ} dB(A) trong khoảng thời gian {TIME_RANGE}.\n\nYêu cầu Anh/Chị chấm dứt triệt để hành vi trong vòng 48 GIỜ kể từ khi nhận được thư này. Nếu tình trạng không chấm dứt, tôi sẽ lập tức báo cáo Ban Quản lý, trình báo Công an lập biên bản xử phạt hành chính và tiến hành khởi kiện dân sự đòi bồi thường thiệt hại."
      }
    },
    "ui": {
      "title": "Trình Tạo Thư Trao Đổi Láng Giềng & Thông Báo Pháp Lý Tiếng Ồn",
      "subtitle": "Dựa trên dữ liệu âm thanh thực tế · 3 sắc thái giao tiếp · Trích dẫn điều luật 9 quốc gia",
      "toneLabel": "Chiến lược sắc thái giao tiếp",
      "toneHint": "Lộ trình giải quyết: Thư ngỏ thân thiện → Trao đổi chính thức → Thông báo pháp lý",
      "toneGentle": "Thư ngỏ thân thiện",
      "toneGentleDesc": "Tôn trọng tình làng nghĩa xóm, giả định không cố ý, kêu gọi sự thông cảm",
      "toneFirm": "Trao đổi chính thức",
      "toneFirmDesc": "Nêu rõ dữ liệu decibel vượt chuẩn, chỉ ra tác động đến giấc ngủ và giới hạn chịu đựng",
      "toneStrict": "Thông báo pháp lý",
      "toneStrictDesc": "Định dạng thông báo pháp lý chuẩn mực, viện dẫn điều luật, thời hạn khắc phục 48h",
      "lblRecipient": "Người nhận / Căn hộ",
      "lblSender": "Người gửi / Căn hộ của bạn",
      "lblJurisdiction": "Hệ thống pháp luật & Ngôn ngữ",
      "scenarioLabel": "Loại tiếng ồn phát sinh (Chọn nhanh)",
      "lblPeak": "Đỉnh âm Lmax",
      "lblAvg": "Mức tương đương LAeq",
      "lblTime": "Khoảng thời gian đo",
      "lblHash": "Mã xác thực số",
      "articlesTitle": "Cơ Sở Pháp Lý & Tiêu Chuẩn Âm Thanh Áp Dụng",
      "previewLabel": "Xem trước văn bản theo thời gian thực",
      "previewHint": "Định dạng tự động · Sẵn sàng in ấn",
      "btnClose": "Đóng",
      "btnCopy": "Sao chép văn bản",
      "btnDocx": "Xuất tệp Word (.docx)",
      "btnPdf": "Xuất tệp PDF",
      "copied": "✓ Đã sao chép toàn bộ văn bản vào bộ nhớ tạm",
      "date": "Ngày: ",
      "evidence": "Mã bằng chứng: ",
      "recipientDefault": "Kính gửi Anh/Chị tầng trên",
      "senderDefault": "Láng giềng tầng dưới",
      "thMetric": "Chỉ số âm học",
      "thValue": "Giá trị ghi nhận",
      "telemetryHeader": "【Biên Bản Ghi Nhận Dữ Liệu Đo Âm Học / Telemetry Log】",
      "legalHeader": "【Điều Khoản Pháp Luật & Tiêu Chuẩn Kỹ Thuật Viện Dẫn】",
      "lblSign": "Chữ ký người gửi: ",
      "lblSignDate": "Ngày: ",
      "disclaimer": "Lưu ý: Văn bản này là biên bản ghi nhận thực tế dân sự phục vụ hòa giải tranh chấp, không thay thế chứng thư kiểm định đo lường của Nhà nước."
    }
  }
};

  // --- XML & ZIP Utilities (Pure JS OpenXML Docx Builder) ---
  function escapeXml(str) {
    return String(str ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }

  function makeCrcTable() {
    const table = new Uint32Array(256);
    for (let n = 0; n < 256; n++) {
      let c = n;
      for (let k = 0; k < 8; k++) {
        c = ((c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
      }
      table[n] = c >>> 0;
    }
    return table;
  }
  const crcTable = makeCrcTable();

  function crc32(bytes) {
    let crc = 0 ^ (-1);
    for (let i = 0; i < bytes.length; i++) {
      crc = (crc >>> 8) ^ crcTable[(crc ^ bytes[i]) & 0xFF];
    }
    return (crc ^ (-1)) >>> 0;
  }

  function buildZip(files) {
    const encoder = new TextEncoder();
    const fileEntries = files.map(function (f) {
      const dataBytes = typeof f.content === 'string' ? encoder.encode(f.content) : new Uint8Array(f.content);
      const nameBytes = encoder.encode(f.name);
      const fileCrc = crc32(dataBytes);
      return {
        name: f.name,
        nameBytes: nameBytes,
        data: dataBytes,
        crc: fileCrc,
        size: dataBytes.length
      };
    });

    const now = new Date();
    const dosTime = ((now.getHours() << 11) | (now.getMinutes() << 5) | (now.getSeconds() >> 1)) & 0xFFFF;
    const dosDate = (((now.getFullYear() - 1980) << 9) | ((now.getMonth() + 1) << 5) | now.getDate()) & 0xFFFF;

    let totalSize = 0;
    for (let i = 0; i < fileEntries.length; i++) {
      totalSize += 30 + fileEntries[i].nameBytes.length + fileEntries[i].size;
      totalSize += 46 + fileEntries[i].nameBytes.length;
    }
    totalSize += 22;

    const buf = new Uint8Array(totalSize);
    const view = new DataView(buf.buffer);
    let pos = 0;

    const localOffsets = [];
    for (let j = 0; j < fileEntries.length; j++) {
      const f = fileEntries[j];
      localOffsets.push(pos);
      view.setUint32(pos, 0x04034b50, true); pos += 4;
      view.setUint16(pos, 20, true); pos += 2;
      view.setUint16(pos, 0x0800, true); pos += 2;
      view.setUint16(pos, 0, true); pos += 2;
      view.setUint16(pos, dosTime, true); pos += 2;
      view.setUint16(pos, dosDate, true); pos += 2;
      view.setUint32(pos, f.crc, true); pos += 4;
      view.setUint32(pos, f.size, true); pos += 4;
      view.setUint32(pos, f.size, true); pos += 4;
      view.setUint16(pos, f.nameBytes.length, true); pos += 2;
      view.setUint16(pos, 0, true); pos += 2;
      buf.set(f.nameBytes, pos); pos += f.nameBytes.length;
      buf.set(f.data, pos); pos += f.data.length;
    }

    const cdOffset = pos;
    for (let k = 0; k < fileEntries.length; k++) {
      const cf = fileEntries[k];
      view.setUint32(pos, 0x02014b50, true); pos += 4;
      view.setUint16(pos, 20, true); pos += 2;
      view.setUint16(pos, 20, true); pos += 2;
      view.setUint16(pos, 0x0800, true); pos += 2;
      view.setUint16(pos, 0, true); pos += 2;
      view.setUint16(pos, dosTime, true); pos += 2;
      view.setUint16(pos, dosDate, true); pos += 2;
      view.setUint32(pos, cf.crc, true); pos += 4;
      view.setUint32(pos, cf.size, true); pos += 4;
      view.setUint32(pos, cf.size, true); pos += 4;
      view.setUint16(pos, cf.nameBytes.length, true); pos += 2;
      view.setUint16(pos, 0, true); pos += 2;
      view.setUint16(pos, 0, true); pos += 2;
      view.setUint16(pos, 0, true); pos += 2;
      view.setUint16(pos, 0, true); pos += 2;
      view.setUint32(pos, 0, true); pos += 4;
      view.setUint32(pos, localOffsets[k], true); pos += 4;
      buf.set(cf.nameBytes, pos); pos += cf.nameBytes.length;
    }
    const cdSize = pos - cdOffset;

    view.setUint32(pos, 0x06054b50, true); pos += 4;
    view.setUint16(pos, 0, true); pos += 2;
    view.setUint16(pos, 0, true); pos += 2;
    view.setUint16(pos, fileEntries.length, true); pos += 2;
    view.setUint16(pos, fileEntries.length, true); pos += 2;
    view.setUint32(pos, cdSize, true); pos += 4;
    view.setUint32(pos, cdOffset, true); pos += 4;
    view.setUint16(pos, 0, true); pos += 2;

    return buf;
  }

  function buildDocxBlob(notice) {
    const contentTypesXml = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
      '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">' +
      '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>' +
      '<Default Extension="xml" ContentType="application/xml"/>' +
      '<Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>' +
      '<Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>' +
      '</Types>';

    const relsXml = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
      '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
      '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>' +
      '</Relationships>';

    const docRelsXml = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
      '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
      '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>' +
      '</Relationships>';

    const stylesXml = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
      '<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">' +
      '<w:docDefaults><w:rPrDefault><w:rPr>' +
      '<w:rFonts w:ascii="Calibri" w:eastAsia="SimSun" w:hAnsi="Calibri" w:cs="Calibri"/>' +
      '<w:sz w:val="22"/><w:szCs w:val="22"/>' +
      '</w:rPr></w:rPrDefault></w:docDefaults>' +
      '</w:styles>';

    const paragraphs = (notice.body || '').split(/\n\s*\n/).map(function (pText) {
      const lines = pText.split('\n').map(function (l) {
        return '<w:r><w:t xml:space="preserve">' + escapeXml(l) + '</w:t></w:r>';
      }).join('<w:r><w:br/></w:r>');
      return '<w:p><w:pPr><w:spacing w:line="320" w:lineRule="auto" w:after="160"/></w:pPr>' + lines + '</w:p>';
    }).join('');

    let articlesXml = '';
    if (Array.isArray(notice.articles) && notice.articles.length) {
      const artLines = notice.articles.map(function (art) {
        return '<w:p><w:pPr><w:spacing w:after="80"/><w:ind w:left="240"/></w:pPr>' +
          '<w:r><w:rPr><w:b/><w:color w:val="1E293B"/></w:rPr><w:t xml:space="preserve">§ </w:t></w:r>' +
          '<w:r><w:rPr><w:color w:val="334155"/></w:rPr><w:t xml:space="preserve">' + escapeXml(art) + '</w:t></w:r></w:p>';
      }).join('');
      articlesXml = '<w:p><w:pPr><w:spacing w:before="240" w:after="100"/></w:pPr>' +
        '<w:r><w:rPr><w:b/><w:sz w:val="24"/><w:color w:val="0F172A"/></w:rPr>' +
        '<w:t>' + escapeXml(notice.legalHeader || 'Statutory Provisions Cited') + '</w:t></w:r></w:p>' +
        artLines;
    }

    const telemetryTableXml = '<w:tbl>' +
      '<w:tblPr><w:tblW w:w="9200" w:type="dxa"/>' +
      '<w:tblBorders>' +
      '<w:top w:val="single" w:sz="6" w:space="0" w:color="CBD5E1"/>' +
      '<w:left w:val="single" w:sz="6" w:space="0" w:color="CBD5E1"/>' +
      '<w:bottom w:val="single" w:sz="6" w:space="0" w:color="CBD5E1"/>' +
      '<w:right w:val="single" w:sz="6" w:space="0" w:color="CBD5E1"/>' +
      '<w:insideH w:val="single" w:sz="4" w:space="0" w:color="E2E8F0"/>' +
      '<w:insideV w:val="single" w:sz="4" w:space="0" w:color="E2E8F0"/>' +
      '</w:tblBorders></w:tblPr>' +
      '<w:tr>' +
      '<w:tc><w:tcPr><w:shd w:val="clear" w:color="auto" w:fill="F1F5F9"/><w:tcW w:w="4600" w:type="dxa"/></w:tcPr><w:p><w:r><w:rPr><w:b/><w:color w:val="0F172A"/></w:rPr><w:t>' + escapeXml(notice.thMetric || 'Acoustic Metric') + '</w:t></w:r></w:p></w:tc>' +
      '<w:tc><w:tcPr><w:shd w:val="clear" w:color="auto" w:fill="F1F5F9"/><w:tcW w:w="4600" w:type="dxa"/></w:tcPr><w:p><w:r><w:rPr><w:b/><w:color w:val="0F172A"/></w:rPr><w:t>' + escapeXml(notice.thValue || 'Recorded Value') + '</w:t></w:r></w:p></w:tc>' +
      '</w:tr>' +
      '<w:tr>' +
      '<w:tc><w:tcPr><w:tcW w:w="4600" w:type="dxa"/></w:tcPr><w:p><w:r><w:t>' + escapeXml(notice.lblPeak || 'Peak Lmax') + '</w:t></w:r></w:p></w:tc>' +
      '<w:tc><w:tcPr><w:tcW w:w="4600" w:type="dxa"/></w:tcPr><w:p><w:r><w:rPr><w:b/><w:color w:val="DC2626"/></w:rPr><w:t>' + escapeXml(notice.peakDb || '72.4') + ' dB(A)</w:t></w:r></w:p></w:tc>' +
      '</w:tr>' +
      '<w:tr>' +
      '<w:tc><w:tcPr><w:tcW w:w="4600" w:type="dxa"/></w:tcPr><w:p><w:r><w:t>' + escapeXml(notice.lblAvg || 'Equivalent Leq') + '</w:t></w:r></w:p></w:tc>' +
      '<w:tc><w:tcPr><w:tcW w:w="4600" w:type="dxa"/></w:tcPr><w:p><w:r><w:rPr><w:b/><w:color w:val="2563EB"/></w:rPr><w:t>' + escapeXml(notice.avgDb || '58.6') + ' dB(A)</w:t></w:r></w:p></w:tc>' +
      '</w:tr>' +
      '<w:tr>' +
      '<w:tc><w:tcPr><w:tcW w:w="4600" w:type="dxa"/></w:tcPr><w:p><w:r><w:t>' + escapeXml(notice.lblTime || 'Monitored Window') + '</w:t></w:r></w:p></w:tc>' +
      '<w:tc><w:tcPr><w:tcW w:w="4600" w:type="dxa"/></w:tcPr><w:p><w:r><w:t>' + escapeXml(notice.timeRange || '23:30 - 02:00') + '</w:t></w:r></w:p></w:tc>' +
      '</w:tr>' +
      '<w:tr>' +
      '<w:tc><w:tcPr><w:tcW w:w="4600" w:type="dxa"/></w:tcPr><w:p><w:r><w:t>' + escapeXml(notice.lblHash || 'SHA-256 Fingerprint') + '</w:t></w:r></w:p></w:tc>' +
      '<w:tc><w:tcPr><w:tcW w:w="4600" w:type="dxa"/></w:tcPr><w:p><w:r><w:rPr><w:sz w:val="18"/><w:color w:val="475569"/></w:rPr><w:t>' + escapeXml(notice.evidenceId || 'STP-VERIFIED-HASH') + '</w:t></w:r></w:p></w:tc>' +
      '</w:tr>' +
      '</w:tbl>';

    const documentXml = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
      '<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">' +
      '<w:body>' +
      '<w:p><w:pPr><w:jc w:val="center"/><w:spacing w:after="80"/></w:pPr>' +
      '<w:r><w:rPr><w:sz w:val="20"/><w:color w:val="64748B"/><w:rFonts w:ascii="Arial Black" w:hAnsi="Arial Black"/></w:rPr><w:t>SOUNDTEST.PRO · CIVILIAN ACOUSTIC EVIDENCE CHAIN</w:t></w:r></w:p>' +
      '<w:p><w:pPr><w:jc w:val="center"/><w:spacing w:after="280"/></w:pPr>' +
      '<w:r><w:rPr><w:b/><w:sz w:val="34"/><w:color w:val="0F172A"/></w:rPr><w:t>' + escapeXml(notice.title) + '</w:t></w:r></w:p>' +
      '<w:p><w:r><w:rPr><w:b/><w:color w:val="0F172A"/></w:rPr><w:t>' + escapeXml(notice.lblRecipient || 'Recipient: ') + '</w:t></w:r><w:r><w:t>' + escapeXml(notice.recipient) + '</w:t></w:r></w:p>' +
      '<w:p><w:r><w:rPr><w:b/><w:color w:val="0F172A"/></w:rPr><w:t>' + escapeXml(notice.lblSender || 'Sender: ') + '</w:t></w:r><w:r><w:t>' + escapeXml(notice.sender) + '</w:t></w:r></w:p>' +
      '<w:p><w:r><w:rPr><w:b/><w:color w:val="0F172A"/></w:rPr><w:t>' + escapeXml(notice.lblDate || 'Date: ') + '</w:t></w:r><w:r><w:t>' + escapeXml(notice.date) + '</w:t></w:r></w:p>' +
      '<w:p><w:pPr><w:spacing w:before="160" w:after="160"/></w:pPr><w:r><w:rPr><w:color w:val="CBD5E1"/></w:rPr><w:t>──────────────────────────────────────────────────────────</w:t></w:r></w:p>' +
      paragraphs +
      '<w:p><w:pPr><w:spacing w:before="240" w:after="100"/></w:pPr><w:r><w:rPr><w:b/><w:sz w:val="24"/><w:color w:val="0F172A"/></w:rPr><w:t>' + escapeXml(notice.telemetryHeader || 'Acoustic Telemetry Log') + '</w:t></w:r></w:p>' +
      telemetryTableXml +
      articlesXml +
      '<w:p><w:pPr><w:spacing w:before="360" w:after="80"/></w:pPr><w:r><w:rPr><w:b/><w:color w:val="0F172A"/></w:rPr><w:t>' + escapeXml(notice.lblSign || 'Signature: ') + '____________________________</w:t></w:r></w:p>' +
      '<w:p><w:r><w:rPr><w:b/><w:color w:val="0F172A"/></w:rPr><w:t>' + escapeXml(notice.lblSignDate || 'Date: ') + escapeXml(notice.date) + '</w:t></w:r></w:p>' +
      '<w:p><w:pPr><w:spacing w:before="300"/><w:jc w:val="center"/></w:pPr><w:r><w:rPr><w:sz w:val="18"/><w:color w:val="94A3B8"/></w:rPr><w:t>' + escapeXml(notice.disclaimer || 'Non-certified civilian documentation record for dispute resolution.') + '</w:t></w:r></w:p>' +
      '<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440"/></w:sectPr>' +
      '</w:body></w:document>';

    const zipBytes = buildZip([
      { name: '[Content_Types].xml', content: contentTypesXml },
      { name: '_rels/.rels', content: relsXml },
      { name: 'word/_rels/document.xml.rels', content: docRelsXml },
      { name: 'word/styles.xml', content: stylesXml },
      { name: 'word/document.xml', content: documentXml }
    ]);

    return typeof Blob !== 'undefined'
      ? new Blob([zipBytes], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' })
      : zipBytes;
  }

  function getJurisdictionName(jurKey, lang) {
    const isZh = typeof lang === 'string' && lang.toLowerCase().startsWith('zh');
    const namesZh = {
      zh: "🇨🇳 中国 (民法典第288条相邻权 & 噪声污染防治法)",
      en: "🇺🇸/🇬🇧 欧美英美法系 (Common Law & Quiet Enjoyment)",
      de: "🇩🇪 德国 (BGB §906 & TA Lärm 宁静权)",
      fr: "🇫🇷 法国 (Code de la santé publique 扰民法典)",
      es: "🇪🇸 西班牙/拉美 (Ley del Ruido 噪音法)",
      ja: "🇯🇵 日本 (民法相邻关系 & 受忍限度论)",
      ko: "🇰🇷 韩国 (共同住宅管理法 & 噪音基准)",
      th: "🇹🇭 泰国 (公共卫生法 พ.ร.บ.การสาธารณสุข)",
      vi: "🇻🇳 越南 (民法典 Bộ luật Dân sự 2015)"
    };
    const namesEn = {
      zh: "🇨🇳 China (Civil Code Art. 288 & Noise Control Law)",
      en: "🇺🇸/🇬🇧 US & UK (Common Law & Quiet Enjoyment)",
      de: "🇩🇪 Germany (BGB §906 & TA Lärm)",
      fr: "🇫🇷 France (Code de la santé publique)",
      es: "🇪🇸 Spain / LatAm (Ley del Ruido)",
      ja: "🇯🇵 Japan (Civil Code & Tolerance Limit)",
      ko: "🇰🇷 South Korea (Multi-Family Housing & Noise Rules)",
      th: "🇹🇭 Thailand (Public Health Act)",
      vi: "🇻🇳 Vietnam (Civil Code 2015 & QCVN 26)"
    };
    if (isZh) return namesZh[jurKey] || LEGAL_DATA[jurKey]?.name || jurKey;
    return namesEn[jurKey] || LEGAL_DATA[jurKey]?.name || jurKey;
  }

  // --- UI Component & Runtime State ---
  let modalEl = null;
  let currentLang = 'en';
  let currentTone = 'gentle';
  let selectedScenarios = new Set(['footstep']);
  let userTier = 'free'; // 'free' | 'single' | 'pro'
  let currentRecord = null;
  let upgradeCallback = null;

  function ensureModal() {
    if (modalEl) return modalEl;

    let el = document.getElementById('legalNoticeModal');
    if (!el) {
      el = document.createElement('div');
      el.id = 'legalNoticeModal';
      el.className = 'legal-notice-modal';
      el.setAttribute('role', 'dialog');
      el.setAttribute('aria-modal', 'true');
      el.setAttribute('aria-labelledby', 'lnmTitle');
      el.innerHTML = `
      <div class="legal-notice-card">
        <div class="lnm-header">
          <div class="lnm-title-wrap">
            <div class="lnm-badge-icon">⚖️</div>
            <div>
              <h3 class="lnm-title" id="lnmTitle">Neighbor Notice & Statutory Demand Generator</h3>
              <p class="lnm-subtitle" id="lnmSubtitle">Backed by Verified Acoustic Telemetry · 3 Tones · 9 Global Legal Jurisdictions</p>
            </div>
          </div>
          <button type="button" class="lnm-close-btn" id="lnmCloseBtn" aria-label="Close">×</button>
        </div>

        <div class="lnm-body">
          <!-- Section: Tone Selection -->
          <div class="lnm-tone-section">
            <div class="lnm-section-label">
              <span id="lnmToneLabel">Communication Strategy</span>
              <span id="lnmToneHint" style="font-size:10.5px;color:#64748b;font-weight:normal;">Escalation Path: Friendly Reminder → Formal Negotiation → Statutory Demand</span>
            </div>
            <div class="lnm-tone-grid">
              <!-- Gentle Card -->
              <div class="lnm-tone-card tone-gentle active" data-tone="gentle">
                <div class="lnm-tone-header">
                  <span>🌱</span>
                  <span id="lnmToneGentleTitle">Gentle Friendly Reminder</span>
                  <span class="lnm-free-badge" style="font-size:9.5px;background:rgba(34,197,94,0.2);color:#4ade80;padding:1px 6px;border-radius:10px;margin-left:auto;">Free</span>
                </div>
                <div class="lnm-tone-desc" id="lnmToneGentleDesc">Good neighbor approach, assumes unintentional, asks for cooperative mindfulness</div>
              </div>
              <!-- Firm Card -->
              <div class="lnm-tone-card tone-firm" data-tone="firm">
                <div class="lnm-tone-header">
                  <span>⚖️</span>
                  <span id="lnmToneFirmTitle">Firm Rational Negotiation</span>
                  <span class="lnm-lock-badge" id="lnmLockFirm" style="font-size:9.5px;background:rgba(59,130,246,0.2);color:#60a5fa;padding:1px 6px;border-radius:10px;margin-left:auto;">🔒 PRO</span>
                </div>
                <div class="lnm-tone-desc" id="lnmToneFirmDesc">Presents empirical exceedance data, outlines sleep disturbance and clear boundaries</div>
              </div>
              <!-- Strict Card -->
              <div class="lnm-tone-card tone-strict" data-tone="strict">
                <div class="lnm-tone-header">
                  <span>🛑</span>
                  <span id="lnmToneStrictTitle">Strict Statutory Demand</span>
                  <span class="lnm-lock-badge" id="lnmLockStrict" style="font-size:9.5px;background:rgba(239,68,68,0.2);color:#f87171;padding:1px 6px;border-radius:10px;margin-left:auto;">🔒 PRO</span>
                </div>
                <div class="lnm-tone-desc" id="lnmToneStrictDesc">Formal legal notice format, cites statutory codes, issues 48h cure deadline</div>
              </div>
            </div>
          </div>

          <!-- Section: Parameters Grid -->
          <div class="lnm-form-grid">
            <div class="lnm-field">
              <label id="lnmLblRecipient" for="lnmInputRecipient">Recipient / Resident</label>
              <input type="text" class="lnm-input" id="lnmInputRecipient" value="Upstairs Neighbor" placeholder="e.g. Apt 402 Resident">
            </div>
            <div class="lnm-field">
              <label id="lnmLblSender" for="lnmInputSender">Sender / Your Name/Unit</label>
              <input type="text" class="lnm-input" id="lnmInputSender" value="Downstairs Neighbor" placeholder="e.g. Apt 302 Resident">
            </div>
            <div class="lnm-field">
              <label id="lnmLblJurisdiction" for="lnmSelectJurisdiction">Legal Jurisdiction & Language</label>
              <select class="lnm-select" id="lnmSelectJurisdiction"></select>
            </div>
          </div>

          <!-- Section: Scenario Chips -->
          <div class="lnm-scenarios-section">
            <div class="lnm-section-label" id="lnmScenarioLabel">Noise Categories (Select Applicable)</div>
            <div class="lnm-chips-wrap" id="lnmChipsWrap"></div>
          </div>

          <!-- Section: Live Preview Box -->
          <div class="lnm-preview-wrap">
            <div class="lnm-section-label" style="display:flex;justify-content:space-between;">
              <span id="lnmPreviewLabel">Document Live Preview</span>
              <span id="lnmPreviewHint" style="font-size:10.5px;color:#64748b;font-weight:normal;">WYSIWYG · Formatted Legal Draft</span>
            </div>
            <div class="lnm-preview-box" id="lnmPreviewBox">
              <div class="lnm-preview-header">
                <div style="font-size:10px;letter-spacing:0.1em;color:#64748b;margin-bottom:2px;">SOUNDTEST.PRO · CIVILIAN ACOUSTIC EVIDENCE CHAIN</div>
                <div class="lnm-preview-title" id="lnmDocTitle">Friendly Neighborhood Note: Sound & Rest Hours</div>
                <div class="lnm-preview-meta">
                  <span id="lnmMetaRecipient">To: Upstairs Neighbor</span>
                  <span id="lnmMetaSender">From: Downstairs Neighbor</span>
                  <span id="lnmMetaDate">Date: 2026-10-08</span>
                </div>
              </div>
              <div class="lnm-preview-body" id="lnmDocBody"></div>

              <!-- Acoustic Telemetry Badge Row -->
              <div class="lnm-telemetry-badge-row">
                <div class="lnm-tb-item">
                  <span class="lnm-tb-label" id="lnmLblPeak">Recorded Peak Lmax</span>
                  <span class="lnm-tb-val val-red" id="lnmValPeak">-- dB</span>
                </div>
                <div class="lnm-tb-item">
                  <span class="lnm-tb-label" id="lnmLblAvg">Equivalent LAeq</span>
                  <span class="lnm-tb-val val-blue" id="lnmValAvg">-- dB</span>
                </div>
                <div class="lnm-tb-item">
                  <span class="lnm-tb-label" id="lnmLblTime">Monitored Window</span>
                  <span class="lnm-tb-val val-cyan" id="lnmValTime" style="font-size:11.5px;">--:-- - --:--</span>
                </div>
                <div class="lnm-tb-item">
                  <span class="lnm-tb-label" id="lnmLblHash">Audit Fingerprint</span>
                  <span class="lnm-tb-val" id="lnmValHash" style="font-size:10px;color:#94a3b8;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">SHA-256...</span>
                </div>
              </div>

              <!-- Cited Articles Box -->
              <div class="lnm-articles-box" id="lnmArticlesBox">
                <div class="lnm-articles-title" id="lnmArticlesTitle">
                  <span>⚖️</span>
                  <span id="lnmArticlesHeaderTitle">Statutory Provisions & Legal Standards Cited</span>
                </div>
                <div id="lnmArticlesList"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer Actions -->
        <div class="lnm-footer">
          <div class="lnm-footer-left">
            <button type="button" class="lnm-btn lnm-btn-cancel" id="lnmBtnCancel">Close</button>
          </div>
          <div class="lnm-footer-right">
            <button type="button" class="lnm-btn lnm-btn-copy" id="lnmBtnCopy">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
              <span id="lnmBtnCopyText">Copy Text</span>
            </button>
            <button type="button" class="lnm-btn lnm-btn-docx" id="lnmBtnDocx">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
              <span id="lnmBtnDocxText">Export Word (.docx)</span>
              <span id="lnmDocxLockBadge" style="display:none;font-size:9.5px;background:rgba(255,255,255,0.25);padding:1px 5px;border-radius:6px;margin-left:4px;">🔒 PRO</span>
            </button>
          </div>
        </div>
      </div>
      `;
      document.body.appendChild(el);
      bindModalEvents(el);
    }
    modalEl = el;
    return modalEl;
  }

  function bindModalEvents(el) {
    // Close button & Cancel button
    const closeBtn = el.querySelector('#lnmCloseBtn');
    const cancelBtn = el.querySelector('#lnmBtnCancel');
    if (closeBtn) closeBtn.onclick = closeModal;
    if (cancelBtn) cancelBtn.onclick = closeModal;

    // Click backdrop to close
    el.onclick = function (e) {
      if (e.target === el) closeModal();
    };

    // ESC key to close
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && el.classList.contains('show')) {
        closeModal();
      }
    });

    // Tone cards
    const toneCards = el.querySelectorAll('.lnm-tone-card');
    toneCards.forEach(function (card) {
      card.onclick = function () {
        const toneKey = card.getAttribute('data-tone');
        if (userTier === 'free' && toneKey !== 'gentle') {
          handleUpgradeTrigger('tone_' + toneKey);
          return;
        }
        currentTone = toneKey;
        toneCards.forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        renderPreview();
      };
    });

    // Jurisdiction select
    const select = el.querySelector('#lnmSelectJurisdiction');
    if (select) {
      select.onchange = function () {
        currentLang = select.value;
        const conf = LEGAL_DATA[currentLang];
        if (conf && conf.ui) {
          const inputRec = el.querySelector('#lnmInputRecipient');
          const inputSnd = el.querySelector('#lnmInputSender');
          if (inputRec && conf.ui.recipientDefault) inputRec.value = conf.ui.recipientDefault;
          if (inputSnd && conf.ui.senderDefault) inputSnd.value = conf.ui.senderDefault;
        }
        renderFullUi();
        renderPreview();
      };
    }

    // Inputs live update
    const recInput = el.querySelector('#lnmInputRecipient');
    const sndInput = el.querySelector('#lnmInputSender');
    if (recInput) recInput.oninput = renderPreview;
    if (sndInput) sndInput.oninput = renderPreview;

    // Copy button
    const copyBtn = el.querySelector('#lnmBtnCopy');
    if (copyBtn) {
      copyBtn.onclick = function () {
        const docData = compileDocumentData();
        const fullText = buildPlainText(docData);
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(fullText).then(function () {
            showNoticeToast(LEGAL_DATA[currentLang]?.ui?.copied || '✓ Text copied to clipboard');
          }).catch(function () {
            fallbackCopy(fullText);
          });
        } else {
          fallbackCopy(fullText);
        }
      };
    }

    // DOCX Export button
    const docxBtn = el.querySelector('#lnmBtnDocx');
    if (docxBtn) {
      docxBtn.onclick = function () {
        if (userTier === 'free') {
          handleUpgradeTrigger('docx_export');
          return;
        }
        const docData = compileDocumentData();
        const blob = buildDocxBlob(docData);
        const fileName = (docData.title || 'SoundTest-Dispute-Notice').replace(/[\\/:*?"<>|\s]+/g, '_') + '.docx';
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(url), 1000);
        showNoticeToast(currentLang === 'zh' ? '✓ Word 格式交涉函导出成功' : '✓ Word (.docx) document exported');
      };
    }
  }

  function fallbackCopy(text) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy');
      showNoticeToast(LEGAL_DATA[currentLang]?.ui?.copied || '✓ Copied to clipboard');
    } catch (err) {
      alert('Failed to copy');
    }
    document.body.removeChild(ta);
  }

  function showNoticeToast(msg) {
    if (typeof window.toast === 'function') {
      window.toast(msg, 'info', 3500);
      return;
    }
    let toastEl = document.getElementById('lnmToast');
    if (!toastEl) {
      toastEl = document.createElement('div');
      toastEl.id = 'lnmToast';
      toastEl.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:#10b981;color:#fff;padding:10px 20px;border-radius:8px;font-size:13px;font-weight:700;z-index:10010;box-shadow:0 8px 24px rgba(0,0,0,0.5);transition:opacity 0.2s;';
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = msg;
    toastEl.style.display = 'block';
    toastEl.style.opacity = '1';
    setTimeout(function () {
      toastEl.style.opacity = '0';
      setTimeout(() => { toastEl.style.display = 'none'; }, 200);
    }, 3000);
  }

  function handleUpgradeTrigger(reason) {
    if (typeof upgradeCallback === 'function') {
      upgradeCallback(reason, currentTone);
      return;
    }
    if (typeof window.openProUpgradeModal === 'function') {
      window.openProUpgradeModal();
      return;
    }
    if (typeof window.openWeChatPayModal === 'function') {
      window.openWeChatPayModal('single');
      return;
    }
    alert('PRO Feature: Upgrading unlocks Formal Notices, Cease & Desist Letters, and Word (.docx) Exports.');
  }

  function renderFullUi() {
    const el = ensureModal();
    const conf = LEGAL_DATA[currentLang] || LEGAL_DATA.en || LEGAL_DATA.zh;
    const ui = conf.ui || {};

    // Titles
    const tTitle = el.querySelector('#lnmTitle');
    const tSub = el.querySelector('#lnmSubtitle');
    if (tTitle) tTitle.textContent = ui.title || (currentLang === 'zh' ? '邻里沟通函与法定催告函生成器' : 'Neighbor Notice & Statutory Demand Generator');
    if (tSub) tSub.textContent = ui.subtitle || (currentLang === 'zh' ? '基于真实声学存证数据 · 3种沟通语气 · 9国/地区法律条文智能援引' : 'Backed by Verified Acoustic Telemetry · 3 Tones · 9 Global Legal Jurisdictions');

    // Tone labels
    const tLbl = el.querySelector('#lnmToneLabel');
    const tHnt = el.querySelector('#lnmToneHint');
    if (tLbl) tLbl.textContent = ui.toneLabel || (currentLang === 'zh' ? '沟通语气策略' : 'Communication Strategy');
    if (tHnt) tHnt.textContent = ui.toneHint || (currentLang === 'zh' ? '阶梯式维权：温和提醒 → 理性交涉 → 严正催告' : 'Escalation Path: Friendly Reminder → Formal Negotiation → Statutory Demand');

    // Free Badge
    const badgeFree = el.querySelector('.lnm-free-badge');
    if (badgeFree) {
      badgeFree.textContent = ui.badgeFree || (currentLang === 'zh' ? '免费开放' : 'Free');
    }

    // Tone cards text
    const tgT = el.querySelector('#lnmToneGentleTitle');
    const tgD = el.querySelector('#lnmToneGentleDesc');
    const tfT = el.querySelector('#lnmToneFirmTitle');
    const tfD = el.querySelector('#lnmToneFirmDesc');
    const tsT = el.querySelector('#lnmToneStrictTitle');
    const tsD = el.querySelector('#lnmToneStrictDesc');
    if (tgT) tgT.textContent = ui.toneGentle || (currentLang === 'zh' ? '温和友善提醒' : 'Gentle Friendly Reminder');
    if (tgD) tgD.textContent = ui.toneGentleDesc || '';
    if (tfT) tfT.textContent = ui.toneFirm || (currentLang === 'zh' ? '正式理性交涉' : 'Firm Rational Negotiation');
    if (tfD) tfD.textContent = ui.toneFirmDesc || '';
    if (tsT) tsT.textContent = ui.toneStrict || (currentLang === 'zh' ? '严正法务催告' : 'Strict Statutory Demand');
    if (tsD) tsD.textContent = ui.toneStrictDesc || '';

    // Form labels
    const lRec = el.querySelector('#lnmLblRecipient');
    const lSnd = el.querySelector('#lnmLblSender');
    const lJur = el.querySelector('#lnmLblJurisdiction');
    const lScn = el.querySelector('#lnmScenarioLabel');
    if (lRec) lRec.textContent = ui.lblRecipient || (currentLang === 'zh' ? '受函方' : 'Recipient / Resident');
    if (lSnd) lSnd.textContent = ui.lblSender || (currentLang === 'zh' ? '发函方' : 'Sender / Your Name/Unit');
    if (lJur) lJur.textContent = ui.lblJurisdiction || (currentLang === 'zh' ? '法律法域与语言' : 'Legal Jurisdiction & Language');
    if (lScn) lScn.textContent = ui.scenarioLabel || (currentLang === 'zh' ? '常见噪音类型' : 'Noise Categories (Select Applicable)');

    // Preview Labels
    const pLbl = el.querySelector('#lnmPreviewLabel');
    const pHnt = el.querySelector('#lnmPreviewHint');
    if (pLbl) pLbl.textContent = ui.previewLabel || (currentLang === 'zh' ? '文书实时预览' : 'Document Live Preview');
    if (pHnt) pHnt.textContent = ui.previewHint || (currentLang === 'zh' ? '所见即所得 · 自动排版' : 'WYSIWYG · Formatted Legal Draft');

    const artHeaderTitle = el.querySelector('#lnmArticlesHeaderTitle');
    if (artHeaderTitle) artHeaderTitle.textContent = ui.legalHeaderTitle || ui.articlesTitle || (currentLang === 'zh' ? '法定法规依据与法律条文' : 'Statutory Provisions & Legal Standards Cited');

    // Telemetry labels
    const lp = el.querySelector('#lnmLblPeak');
    const la = el.querySelector('#lnmLblAvg');
    const lt = el.querySelector('#lnmLblTime');
    const lh = el.querySelector('#lnmLblHash');
    if (lp) lp.textContent = ui.lblPeak || (currentLang === 'zh' ? '实测峰值 Lmax' : 'Recorded Peak Lmax');
    if (la) la.textContent = ui.lblAvg || (currentLang === 'zh' ? '等效均值 LAeq' : 'Equivalent LAeq');
    if (lt) lt.textContent = ui.lblTime || (currentLang === 'zh' ? '监测时段' : 'Monitored Window');
    if (lh) lh.textContent = ui.lblHash || (currentLang === 'zh' ? '数字存证指纹' : 'Audit Fingerprint');

    // Button labels
    const bCp = el.querySelector('#lnmBtnCopyText');
    const bDx = el.querySelector('#lnmBtnDocxText');
    const bCn = el.querySelector('#lnmBtnCancel');
    if (bCp) bCp.textContent = ui.btnCopy || (currentLang === 'zh' ? '复制文本' : 'Copy Text');
    if (bDx) bDx.textContent = ui.btnDocx || (currentLang === 'zh' ? '导出 Word (.docx)' : 'Export Word (.docx)');
    if (bCn) bCn.textContent = ui.btnClose || (currentLang === 'zh' ? '关闭' : 'Close');

    // Populate Jurisdiction select options localized to currentLang
    const select = el.querySelector('#lnmSelectJurisdiction');
    if (select) {
      select.innerHTML = '';
      Object.keys(LEGAL_DATA).forEach(function (k) {
        const opt = document.createElement('option');
        opt.value = k;
        opt.textContent = getJurisdictionName(k, currentLang);
        if (k === currentLang) opt.selected = true;
        select.appendChild(opt);
      });
      select.value = currentLang;
    }

    // Populate scenario chips
    const chipsWrap = el.querySelector('#lnmChipsWrap');
    if (chipsWrap) {
      chipsWrap.innerHTML = '';
      const scMap = conf.scenarios || {};
      Object.keys(scMap).forEach(function (k) {
        const chip = document.createElement('button');
        chip.type = 'button';
        chip.className = 'lnm-chip' + (selectedScenarios.has(k) ? ' active' : '');
        chip.setAttribute('data-scenario-key', k);
        chip.innerHTML = '<span>' + (getScenarioIcon(k)) + '</span><span>' + escapeXml(scMap[k]) + '</span>';
        chip.onclick = function () {
          if (selectedScenarios.has(k)) {
            if (selectedScenarios.size > 1) selectedScenarios.delete(k);
          } else {
            selectedScenarios.add(k);
          }
          chip.classList.toggle('active', selectedScenarios.has(k));
          renderPreview();
        };
        chipsWrap.appendChild(chip);
      });
    }

    // Lock badges depending on user tier
    syncTierUi(el);
  }

  function getScenarioIcon(k) {
    const icons = {
      footstep: '👣',
      music: '🔊',
      dragging: '🪑',
      renovation: '🔨',
      pet: '🐕',
      party: '🎉'
    };
    return icons[k] || '⚠️';
  }

  function syncTierUi(el) {
    const isFree = (userTier === 'free');
    const lockFirm = el.querySelector('#lnmLockFirm');
    const lockStrict = el.querySelector('#lnmLockStrict');
    const docxBadge = el.querySelector('#lnmDocxLockBadge');

    if (lockFirm) lockFirm.style.display = isFree ? 'inline' : 'none';
    if (lockStrict) lockStrict.style.display = isFree ? 'inline' : 'none';
    if (docxBadge) docxBadge.style.display = isFree ? 'inline' : 'none';

    // Tone cards
    const cardFirm = el.querySelector('.lnm-tone-card[data-tone="firm"]');
    const cardStrict = el.querySelector('.lnm-tone-card[data-tone="strict"]');
    if (cardFirm) cardFirm.classList.toggle('lnm-locked-card', isFree);
    if (cardStrict) cardStrict.classList.toggle('lnm-locked-card', isFree);
  }

  function compileDocumentData() {
    const el = ensureModal();
    const conf = LEGAL_DATA[currentLang] || LEGAL_DATA.en || LEGAL_DATA.zh;
    const toneObj = conf.tones?.[currentTone] || conf.tones?.gentle || {};
    const ui = conf.ui || {};

    const rec = currentRecord || {};
    const peakDb = rec.peakDb || '72.4';
    const avgDb = rec.avgDb || '58.6';
    const timeRange = rec.timeRange || (formatCurrentTimeRange());
    const evidenceId = rec.evidenceId || ('STP-' + Math.random().toString(36).substring(2, 9).toUpperCase());
    const location = rec.location || 'Residential Unit';
    const dateStr = rec.date || (new Date().toISOString().slice(0, 10));

    const recipientInput = el.querySelector('#lnmInputRecipient');
    const senderInput = el.querySelector('#lnmInputSender');
    const defaultRecipient = ui.recipientDefault || (currentLang === 'zh' ? '楼上邻居' : 'Upstairs Neighbor');
    const defaultSender = ui.senderDefault || (currentLang === 'zh' ? '楼下邻居' : 'Downstairs Neighbor');
    const recipient = (recipientInput?.value || defaultRecipient).trim();
    const sender = (senderInput?.value || defaultSender).trim();

    // Noise types string
    const scMap = conf.scenarios || {};
    const noiseList = Array.from(selectedScenarios).map(k => scMap[k] || k);
    const sep = (currentLang === 'zh' || currentLang === 'ja') ? '、' : ', ';
    const fallbackNoise = (currentLang === 'zh') ? '生活撞击声' : 'residential impact noise';
    const noiseTypes = noiseList.join(sep) || fallbackNoise;

    // Replace template variables
    let bodyText = toneObj.body || '';
    bodyText = bodyText.replace(/\{NOISE_TYPES\}/g, noiseTypes)
      .replace(/\{PEAK\}/g, peakDb)
      .replace(/\{LEQ\}/g, avgDb)
      .replace(/\{TIME_RANGE\}/g, timeRange)
      .replace(/\{EVIDENCE_ID\}/g, evidenceId)
      .replace(/\{RECIPIENT\}/g, recipient)
      .replace(/\{SENDER\}/g, sender)
      .replace(/\{LOCATION\}/g, location)
      .replace(/\{DATE\}/g, dateStr);

    return {
      title: toneObj.title || 'CIVILIAN DISPUTE NOTICE',
      recipient: recipient,
      sender: sender,
      date: dateStr,
      location: location,
      peakDb: peakDb,
      avgDb: avgDb,
      timeRange: timeRange,
      evidenceId: evidenceId,
      body: bodyText,
      articles: conf.laws || [],
      lblRecipient: ui.lblRecipient || (currentLang === 'zh' ? '受函方：' : 'Recipient: '),
      lblSender: ui.lblSender || (currentLang === 'zh' ? '发函方：' : 'Sender: '),
      lblDate: ui.date || (currentLang === 'zh' ? '日期：' : 'Date: '),
      lblPeak: ui.lblPeak || (currentLang === 'zh' ? '实测峰值 Lmax' : 'Recorded Peak Lmax'),
      lblAvg: ui.lblAvg || (currentLang === 'zh' ? '等效均值 LAeq' : 'Equivalent LAeq'),
      lblTime: ui.lblTime || (currentLang === 'zh' ? '监测时段' : 'Monitored Window'),
      lblHash: ui.lblHash || (currentLang === 'zh' ? '数字存证指纹' : 'Audit Fingerprint'),
      thMetric: ui.thMetric || (currentLang === 'zh' ? '声学监测指标' : 'Acoustic Metric'),
      thValue: ui.thValue || (currentLang === 'zh' ? '实测读数' : 'Recorded Value'),
      telemetryHeader: ui.telemetryHeader || (currentLang === 'zh' ? '【现场声学测量数据证据表】' : '【Acoustic Telemetry Log】'),
      legalHeader: ui.legalHeader || (currentLang === 'zh' ? '【法定法规条文与法律依据】' : '【Statutory Provisions & Legal Standards Cited】'),
      lblSign: ui.lblSign || (currentLang === 'zh' ? '通知方签署: ' : 'Sender Signature: '),
      lblSignDate: ui.lblSignDate || (currentLang === 'zh' ? '签署日期: ' : 'Signed Date: '),
      disclaimer: ui.disclaimer || (currentLang === 'zh' ? '注：本函及所附声学数据为民事自查事实记录，用于敦促沟通与民事纠纷事实举证。' : 'Notice: This notice and acoustic data serve as civil documentation for communication and dispute resolution.')
    };
  }

  function formatCurrentTimeRange() {
    const d = new Date();
    const endH = String(d.getHours()).padStart(2, '0');
    const endM = String(d.getMinutes()).padStart(2, '0');
    const startD = new Date(d.getTime() - 90 * 60000);
    const startH = String(startD.getHours()).padStart(2, '0');
    const startM = String(startD.getMinutes()).padStart(2, '0');
    return `${startH}:${startM} - ${endH}:${endM}`;
  }

  function renderPreview() {
    const el = ensureModal();
    const doc = compileDocumentData();

    const tEl = el.querySelector('#lnmDocTitle');
    const bEl = el.querySelector('#lnmDocBody');
    const rEl = el.querySelector('#lnmMetaRecipient');
    const sEl = el.querySelector('#lnmMetaSender');
    const dEl = el.querySelector('#lnmMetaDate');
    const vpEl = el.querySelector('#lnmValPeak');
    const vaEl = el.querySelector('#lnmValAvg');
    const vtEl = el.querySelector('#lnmValTime');
    const vhEl = el.querySelector('#lnmValHash');
    const artList = el.querySelector('#lnmArticlesList');
    const artTitle = el.querySelector('#lnmArticlesHeaderTitle');

    if (tEl) tEl.textContent = doc.title;
    if (bEl) bEl.textContent = doc.body;
    if (rEl) rEl.textContent = (doc.lblRecipient || (currentLang === 'zh' ? '受函方：' : 'To: ')) + ' ' + doc.recipient;
    if (sEl) sEl.textContent = (doc.lblSender || (currentLang === 'zh' ? '发函方：' : 'From: ')) + ' ' + doc.sender;
    if (dEl) dEl.textContent = (doc.lblDate || (currentLang === 'zh' ? '日期：' : 'Date: ')) + ' ' + doc.date;

    if (vpEl) vpEl.textContent = doc.peakDb + ' dB(A)';
    if (vaEl) vaEl.textContent = doc.avgDb + ' dB(A)';
    if (vtEl) vtEl.textContent = doc.timeRange;
    if (vhEl) {
      vhEl.textContent = doc.evidenceId;
      vhEl.title = doc.evidenceId;
    }

    if (artTitle) artTitle.textContent = doc.legalHeader;
    if (artList) {
      artList.innerHTML = doc.articles.map(function (art) {
        return '<div style="margin-top:6px;padding-left:10px;border-left:2px solid rgba(251,191,36,0.5);color:#cbd5e1;">§ ' + escapeXml(art) + '</div>';
      }).join('');
    }
  }

  function buildPlainText(doc) {
    const sep = '──────────────────────────────────────────────────────────';
    let text = 'SOUNDTEST.PRO · CIVILIAN ACOUSTIC EVIDENCE CHAIN\n\n' +
      doc.title + '\n\n' +
      (doc.lblRecipient || 'Recipient: ') + doc.recipient + '\n' +
      (doc.lblSender || 'Sender: ') + doc.sender + '\n' +
      (doc.lblDate || 'Date: ') + doc.date + '\n' +
      sep + '\n\n' +
      doc.body + '\n\n' +
      doc.telemetryHeader + '\n' +
      '- ' + doc.lblPeak + ': ' + doc.peakDb + ' dB(A)\n' +
      '- ' + doc.lblAvg + ': ' + doc.avgDb + ' dB(A)\n' +
      '- ' + doc.lblTime + ': ' + doc.timeRange + '\n' +
      '- ' + doc.lblHash + ': ' + doc.evidenceId + '\n\n' +
      doc.legalHeader + '\n';

    doc.articles.forEach(function (art) {
      text += '§ ' + art + '\n';
    });

    text += '\n' + doc.lblSign + '\n' + doc.lblSignDate + doc.date + '\n\n' + doc.disclaimer;
    return text;
  }

  function openModal(recordData, options) {
    const el = ensureModal();
    currentRecord = recordData || {};
    const opts = options || {};

    userTier = opts.userTier || 'free';
    if (opts.lang && LEGAL_DATA[opts.lang]) {
      currentLang = opts.lang;
    } else if (typeof window.appLanguage === 'string' && window.appLanguage.startsWith('zh')) {
      currentLang = 'zh';
    } else if (typeof window.appLanguage === 'string') {
      const p = window.appLanguage.slice(0, 2).toLowerCase();
      currentLang = LEGAL_DATA[p] ? p : 'en';
    }

    currentTone = opts.tone || 'gentle';
    if (userTier === 'free') {
      currentTone = 'gentle';
    }

    if (opts.onUpgrade) {
      upgradeCallback = opts.onUpgrade;
    }

    // Set recipient and sender from options if provided
    const conf = LEGAL_DATA[currentLang] || LEGAL_DATA.en || LEGAL_DATA.zh;
    const inputRec = el.querySelector('#lnmInputRecipient');
    const inputSnd = el.querySelector('#lnmInputSender');
    if (inputRec) {
      inputRec.value = opts.recipient || currentRecord.recipient || conf.ui?.recipientDefault || (currentLang === 'zh' ? '楼上邻居您好' : 'Upstairs Neighbor');
    }
    if (inputSnd) {
      inputSnd.value = opts.sender || currentRecord.sender || conf.ui?.senderDefault || (currentLang === 'zh' ? '楼下邻居' : 'Downstairs Neighbor');
    }

    // Sync active tone card
    const toneCards = el.querySelectorAll('.lnm-tone-card');
    toneCards.forEach(c => {
      c.classList.toggle('active', c.getAttribute('data-tone') === currentTone);
    });

    renderFullUi();
    renderPreview();

    el.classList.add('show');
  }

  function closeModal() {
    if (modalEl) {
      modalEl.classList.remove('show');
    }
  }

  return {
    openModal: openModal,
    closeModal: closeModal,
    buildDocxBlob: buildDocxBlob,
    compileDocumentData: compileDocumentData,
    buildPlainText: buildPlainText,
    getLegalData: function () { return LEGAL_DATA; },
    setUserTier: function (tier) {
      userTier = tier;
      if (modalEl) syncTierUi(modalEl);
    },
    getUserTier: function () { return userTier; },
    setUpgradeHandler: function (fn) { upgradeCallback = fn; }
  };
}));
