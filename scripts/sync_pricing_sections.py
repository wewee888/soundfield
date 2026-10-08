import os, re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Shared Creem checkout links
URL_SINGLE = "https://www.creem.io/payment/prod_2Xc2ichF1Xk2mmzrhBxyYC"
URL_MONTHLY = "https://www.creem.io/payment/prod_4jTdMPIau4Pzn1HKHPW9NQ"
URL_YEARLY = "https://www.creem.io/payment/prod_18imyd506sx0xFOcMiqB2c"
URL_LIFETIME = "https://www.creem.io/payment/prod_18nHbuAQNpc4n334rM9hGV"

SECTIONS = {
    'de': {
        'eyebrow': 'Tarife &amp; Preise',
        'title': 'Kostenlos für Soforttests. Strukturierte Lärmprotokolle für Vermietergespräche freischalten.',
        'lead': 'Dezibelmessungen im Browser sind 100% kostenlos. Bei anhaltender Lärmbelästigung schalten Sie detaillierte zivile Lärmprotokolle ab 1,99 $ frei.',
        'banner': 'Frühbucher-Vorteil: Aktuelle Preise sind zeitlich begrenzte Einführungspreise. Nach Ablauf der Startphase gelten wieder die regulären Tarife (4,99 $ Einzel / 9,99 $ Monat / 59,99 $ Jahr / 199 $ Lifetime). Sichern Sie sich den Dauerrabatt!',
        'free': {
            'pill': 'Kostenlose Version',
            'name': 'Web-Tool sofort starten',
            'tag': '$0',
            'hint': 'Schnelle akustische Basismessung zum Abgleich mit IEC-Normen &amp; Richtwerten',
            'items': [
                'Echtzeit-Dezibelmessung (A/C-Bewertung)',
                'Audioaufnahme &amp; Frequenzwellenform',
                'Automatischer Zeit- und GPS-Standortstempel',
                'Vorschaubericht mit Wasserzeichen (zur Orientierung)',
                'Lokale Zwischenspeicherung im Browser'
            ],
            'btn': 'Kostenlos testen'
        },
        'single': {
            'pill': 'Einzelauswertung',
            'name': 'Offizieller Beweisbericht',
            'price': '1,99 $',
            'del': '4,99 $',
            'discount': '60% RABATT',
            'hint': 'Einmaliger Kauf · Widerlegt Ausreden zur Lautstärkemanipulation',
            'items': [
                '1 Vollständiger <strong>PDF-Beweisbericht ohne Wasserzeichen</strong>',
                '<strong>Kryptografischer SHA-256 Fingerabdruck</strong> &amp; GPS-Prägung',
                'Normierte Kennwerte (LAeq, L10, L90, Maximalpegel)',
                'Fotodokumentation &amp; Zeit-Stempel-Protokollblatt',
                'Offizielle Unterlage für Hausverwaltung, Vermieter oder Schlichtung'
            ],
            'btn': 'Einzelbericht freischalten · 1,99 $'
        },
        'monthly': {
            'pill': 'Pro Monatskarte',
            'name': 'Pro Monatszugang',
            'price': '4,99 $<small style="font-size:13px;color:var(--soft);">/Monat</small>',
            'del': '9,99 $',
            'discount': '50% RABATT',
            'hint': 'Ideal für zeitlich begrenzte Ruhestörungen, Baustellen oder Mietprüfungen',
            'items': [
                '<strong>30 Tage unbegrenzte</strong> PDF-Beweisberichte ohne Wasserzeichen',
                '🌙 <strong>Nacht-Wächter-Modus</strong>: Automatische Protokollierung bei Grenzwertüberschreitung',
                '📊 <strong>Mehrtägiges Stördossier</strong>: 30-Tage Trendkurven &amp; Häufigkeitsanalysen',
                '⚖️ <strong>Juristische Beschwerdevorlagen</strong>: Standardisierte Abmahnschreiben &amp; Rügen',
                '☁️ <strong>Verschlüsselte Cloud-Synchronisation</strong>: Sicherer Beweiserhalt über Geräte hinweg'
            ],
            'btn': 'Pro Monat sichern · 4,99 $'
        },
        'yearly': {
            'popular': '★ Beliebteste Wahl · Nur ca. 2,08 $/Monat',
            'pill': 'Pro Jahresversion',
            'name': 'Langzeit-Beweisakte',
            'price': '24,99 $<small style="font-size:13px;color:var(--soft);">/Jahr</small>',
            'del': '59,99 $',
            'discount': '35 $ Ersparnis',
            'hint': '365 Tage automatisierte Überwachung · Entlastet von manueller Protokollierung',
            'items': [
                '<strong>365 Tage unbegrenzte</strong> offizielle PDF-Beweisberichte',
                '🌙 <strong>Nacht-Wächter-Modus</strong>: Lückenlose Erfassung nächtlicher Ruhestörungen',
                '📊 <strong>Mehrtägiges Stördossier</strong>: Monatsübergreifende Lärmverlaufskurven',
                '⚖️ <strong>Juristische Beschwerdevorlagen</strong>: Formblätter für Vermieter &amp; Behörden',
                '☁️ <strong>Verschlüsselte Cloud-Synchronisation</strong>: Dauerhafte Sicherung &amp; Multi-Device-Sync'
            ],
            'btn': 'Pro Jahrespass holen · 24,99 $',
            'account': 'Bereits ein Konto? Anmelden'
        },
        'lifetime': {
            'pill': 'Lebenslange Lizenz',
            'name': 'Unbegrenzter Vollzugang',
            'price': '79,99 $',
            'del': '199,00 $',
            'discount': '60% RABATT',
            'hint': 'Einmalzahlung · Dauerhafte Gewissheit &amp; Rechtssicherheit ohne Abo',
            'items': [
                '<strong>Dauerhafte Volllizenz</strong> ohne wiederkehrende Gebühren oder Abofallen',
                'Enthält alle Wächter-Funktionen, Stördossiers und Musterschreiben',
                'Geräteübergreifende Synchronisation &amp; dauerhafter Cloud-Speicher',
                'Prioritäts-Support &amp; alle zukünftigen Akustik-Updates inklusive',
                'Jederzeit einsatzbereit bei Miet-, Nachbarschafts- oder Gewerbekonflikten'
            ],
            'btn': 'Lebenslang sichern · 79,99 $',
            'account': 'Bereits ein Konto? Anmelden'
        },
        'matrix': {
            'th_feature': 'Funktionen &amp; Leistungsmerkmale',
            'th_free': 'Kostenlose Basis',
            'th_single': 'Einzelbericht',
            'th_monthly': 'Pro Monat',
            'th_pro': 'Pro Jahr ★',
            'th_lifetime': 'Lebenslang',
            'f1_name': 'Echtzeit-Dezibelüberwachung', 'f1_desc': 'A/C-Bewertung, Frequenzspektrum-Kurve',
            'f2_name': 'Audio- &amp; Foto-Beweissicherung', 'f2_desc': 'Manipulationssichere Zeit- &amp; GPS-Prägung',
            'f3_name': 'Offizieller PDF-Beweisbericht', 'f3_desc': 'Ohne Wasserzeichen, für Hausverwaltung &amp; Schlichtung',
            'f4_name': 'Kryptografischer SHA-256 Fingerabdruck', 'f4_desc': 'Beweist Echtheit gegen Vorwürfe von Lautstärkemanipulation',
            'f5_name': '🌙 Nacht-Wächter-Modus', 'f5_desc': 'Energiesparende Hintergrundüberwachung mit automatischer Ereigniserfassung',
            'f6_name': '📊 Mehrtägiges Stördossier', 'f6_desc': 'Aggregierte Trendkurven &amp; Wiederholungsstatistiken',
            'f7_name': '⚖️ Juristische Beschwerdevorlagen', 'f7_desc': 'Abmahnschreiben, Schlichtungsunterlagen &amp; Mängelanzeigen',
            'f8_name': 'Multi-Device-Sync &amp; Cloud-Speicher', 'f8_desc': 'Sicherer Erhalt der Beweise auch bei Gerätewechsel',
            'f9_name': 'Gültigkeitsdauer &amp; Aktionspreis', 'f9_desc': 'Einführungspreise für Frühbucher; spätere Rückkehr zu Standardpreisen'
        }
    ,
        'disclaimer_note': 'SOUNDTEST.PRO dient als ziviles Dokumentationswerkzeug für Schlichtungsverfahren und Nachbarschaftsdialoge, nicht als amtlich geeichtes Schallpegelmessgerät. Gesetzliche Verwaltungsverfahren erfordern Messungen mit kalibrierten Klasse-1/2-Geräten.'
    },
    'fr': {
        'eyebrow': 'Formules &amp; Tarifs',
        'title': 'Gratuit pour les vérifications immédiates. Débloquez des relevés objectifs en cas de besoin.',
        'lead': 'La mesure de décibels dans le navigateur est 100% gratuite. Pour appuyer vos démarches amiables, débloquez des dossiers de relevés civils structurés dès 1,99 $.',
        'banner': 'Offre de lancement exclusive : Tarifs spéciaux pour les premiers utilisateurs. Après la phase initiale, les prix normaux s\'appliqueront (4,99 $ Unique / 9,99 $ Mois / 59,99 $ An / 199 $ À vie). Profitez de la remise garantie !',
        'free': {
            'pill': 'Version Gratuite',
            'name': 'Outil Web instantané',
            'tag': '$0',
            'hint': 'Mesure acoustique de référence pour comparer vos niveaux aux normes IEC &amp; seuils recommandés',
            'items': [
                'Sonomètre en temps réel (pondération A/C)',
                'Enregistrement audio &amp; forme d\'onde en direct',
                'Horodatage et coordonnées GPS automatiques',
                'Rapport d\'aperçu filigrané (usage personnel)',
                'Stockage local temporaire dans le navigateur'
            ],
            'btn': 'Essayer gratuitement'
        },
        'single': {
            'pill': 'Export Unique',
            'name': 'Rapport Probant Officiel',
            'price': '1,99 $',
            'del': '4,99 $',
            'discount': '60% DE RÉDUCTION',
            'hint': 'Achat unique · Écarte toute contestation de manipulation du volume',
            'items': [
                '1 <strong>Rapport probant PDF officiel sans filigrane</strong>',
                '<strong>Empreinte numérique SHA-256</strong> &amp; ancrage GPS',
                'Indicateurs normalisés (LAeq, L10, L90, niveau de crête)',
                'Planche de preuves avec photos horodatées et géolocalisation',
                'Dossier opposable pour syndic, propriétaire ou conciliation'
            ],
            'btn': 'Débloquer le rapport · 1,99 $'
        },
        'monthly': {
            'pill': 'Pro Mensuel Flexible',
            'name': 'Accès Pro Mensuel',
            'price': '4,99 $<small style="font-size:13px;color:var(--soft);">/mois</small>',
            'del': '9,99 $',
            'discount': '50% DE RÉDUCTION',
            'hint': 'Idéal pour litiges ponctuels, chantiers temporaires ou baux courts',
            'items': [
                '<strong>30 jours de rapports PDF illimités</strong> sans filigrane',
                '🌙 <strong>Mode Sentinelle Nocturne</strong> : Enregistrement auto dès dépassement du seuil',
                '📊 <strong>Dossier de Nuisances Multi-Jours</strong> : Graphiques de tendance sur 30 jours',
                '⚖️ <strong>Modèles de Courriers Juridiques</strong> : Mises en demeure et signalements types',
                '☁️ <strong>Synchronisation Cloud Chiffrée</strong> : Sauvegarde sécurisée multi-appareils'
            ],
            'btn': 'Choisir Pro Mensuel · 4,99 $'
        },
        'yearly': {
            'popular': '★ Le Plus Populaire · ~2,08 $/mois seulement',
            'pill': 'Pro Annuel Premium',
            'name': 'Dossier de Litige Continu',
            'price': '24,99 $<small style="font-size:13px;color:var(--soft);">/an</small>',
            'del': '59,99 $',
            'discount': 'Économisez 35 $',
            'hint': '365 jours de surveillance automatisée · Vous libère de la veille manuelle',
            'items': [
                '<strong>365 jours de rapports PDF illimités</strong> détaillés pour médiation',
                '🌙 <strong>Mode Sentinelle Nocturne</strong> : Capture automatique des dépassements de nuit',
                '📊 <strong>Dossier de Nuisances Multi-Jours</strong> : Historique complet et courbes d\'exposition',
                '⚖️ <strong>Modèles de Courriers Juridiques</strong> : Actes pour bailleurs, syndics et médiation',
                '☁️ <strong>Synchronisation Cloud Chiffrée</strong> : Sauvegarde pérenne sans perte de données'
            ],
            'btn': 'Prendre Pro Annuel · 24,99 $',
            'account': 'Déjà un compte ? Se connecter'
        },
        'lifetime': {
            'pill': 'Licence à Vie',
            'name': 'Accès Intégral Perpétuel',
            'price': '79,99 $',
            'del': '199,00 $',
            'discount': '60% DE RÉDUCTION',
            'hint': 'Paiement unique · Sérénité permanente pour locataires et propriétaires',
            'items': [
                '<strong>Licence perpétuelle sans abonnement</strong> ni frais récurrents',
                'Inclut toutes les fonctionnalités Sentinelle, Dossiers et Modèles',
                'Synchronisation multi-appareils &amp; stockage cloud illimité',
                'Support prioritaire &amp; toutes les futures évolutions acoustiques incluses',
                'Prêt à tout moment en cas de litige de voisinage, bail ou chantier'
            ],
            'btn': 'Accès à Vie · 79,99 $',
            'account': 'Déjà un compte ? Se connecter'
        },
        'matrix': {
            'th_feature': 'Fonctionnalités &amp; Avantages',
            'th_free': 'Gratuit de Base',
            'th_single': 'Rapport Unique',
            'th_monthly': 'Pro Mensuel',
            'th_pro': 'Pro Annuel ★',
            'th_lifetime': 'Licence à Vie',
            'f1_name': 'Mesure dB en Temps Réel', 'f1_desc': 'Pondération A/C, spectre de fréquences en direct',
            'f2_name': 'Capture Audio &amp; Photo de Preuve', 'f2_desc': 'Horodatage infalsifiable &amp; géolocalisation GPS',
            'f3_name': 'Rapport PDF Probant Officiel', 'f3_desc': 'Sans filigrane, prêt pour syndics, propriétaires et médiation',
            'f4_name': 'Empreinte Cryptographique SHA-256', 'f4_desc': 'Écarte toute contestation de manipulation du volume',
            'f5_name': '🌙 Mode Sentinelle Nocturne', 'f5_desc': 'Veille basse consommation avec enregistrement automatique',
            'f6_name': '📊 Dossier de Nuisances Multi-Jours', 'f6_desc': 'Courbes d\'évolution &amp; fréquences de dépassement',
            'f7_name': '⚖️ Modèles Juridiques de Plainte', 'f7_desc': 'Mises en demeure, dossiers de conciliation &amp; courriers',
            'f8_name': 'Synchronisation &amp; Sauvegarde Cloud', 'f8_desc': 'Preuves préservées même en changeant de téléphone',
            'f9_name': 'Durée &amp; Tarif Promotionnel', 'f9_desc': 'Tarifs de lancement anticipé ; retour aux prix standards ensuite'
        }
    ,
        'disclaimer_note': 'SOUNDTEST.PRO est un outil d\'estimation et de documentation civile pour la médiation, et non un sonomètre légalement certifié. Les procédures formelles d\'exécution peuvent nécessiter des mesures avec un appareil de métrologie homologué.'
    },
    'es': {
        'eyebrow': 'Planes y Precios',
        'title': 'Gratis para comprobaciones inmediatas. Desbloquee registros de ruido objetivos cuando necesite actuar.',
        'lead': 'La medición en el navegador es 100% gratuita. Para fundamentar quejas vecinales o mediación, desbloquee informes civiles estructurados desde 1,99 $.',
        'banner': 'Oferta especial de lanzamiento: Precios reducidos de acceso anticipado. Posteriormente se restablecerán los precios estándar (4,99 $ Único / 9,99 $ Mensual / 59,99 $ Anual / 199 $ De por vida). ¡Asegure su tarifa hoy!',
        'free': {
            'pill': 'Versión Gratuita',
            'name': 'Medición Web Inmediata',
            'tag': '$0',
            'hint': 'Medición acústica de referencia rápida para comparar niveles frente a normas IEC y umbrales acústicos',
            'items': [
                'Sonómetro en tiempo real (ponderación A/C)',
                'Grabación de audio y visualización de onda',
                'Estampado automático de fecha y GPS',
                'Informe con marca de agua (uso orientativo)',
                'Almacenamiento temporal en el navegador'
            ],
            'btn': 'Probar sonómetro gratis'
        },
        'single': {
            'pill': 'Informe Único',
            'name': 'Informe Acústico Formal',
            'price': '1,99 $',
            'del': '4,99 $',
            'discount': '60% DTO.',
            'hint': 'Pago único · Desmonta acusaciones de haber subido el volumen',
            'items': [
                '1 <strong>Informe PDF estructurado sin marcas de agua</strong>',
                '<strong>Firma criptográfica SHA-256</strong> y anclaje GPS',
                'Métricas acústicas oficiales (LAeq, L10, L90, pico en dB)',
                'Anexo de evidencias con fotos y coordenadas estampadas',
                'Documentación formal para administradores, caseros o mediación'
            ],
            'btn': 'Desbloquear informe · 1,99 $'
        },
        'monthly': {
            'pill': 'Pro Mensual Flexible',
            'name': 'Acceso Pro Mensual',
            'price': '4,99 $<small style="font-size:13px;color:var(--soft);">/mes</small>',
            'del': '9,99 $',
            'discount': '50% DTO.',
            'hint': 'Ideal para disputas breves, reformas temporales o inspecciones de alquiler',
            'items': [
                '<strong>30 días de informes PDF ilimitados</strong> sin marcas de agua',
                '🌙 <strong>Modo Centinela Nocturno</strong>: Grabación automática al superar el límite',
                '📊 <strong>Dossier de Nuisances Multi-Días</strong>: Gráficos agregados de 30 días',
                '⚖️ <strong>Plantillas de Reclamación Jurídica</strong>: Notificaciones formales y requerimientos',
                '☁️ <strong>Sincronización en la Nube Cifrada</strong>: Conservación segura entre dispositivos'
            ],
            'btn': 'Obtener Pro Mensual · 4,99 $'
        },
        'yearly': {
            'popular': '★ Más Popular · Solo ~2,08 $/mes',
            'pill': 'Pro Premium Anual',
            'name': 'Dossier de Conflicto Continuo',
            'price': '24,99 $<small style="font-size:13px;color:var(--soft);">/año</small>',
            'del': '59,99 $',
            'discount': 'Ahorra 35 $',
            'hint': '365 días de monitorización desatendida · Olvídese de vigilar manualmente',
            'items': [
                '<strong>365 días de generación ilimitada</strong> de informes probatorios',
                '🌙 <strong>Modo Centinela Nocturno</strong>: Detección automática de perturbaciones',
                '📊 <strong>Dossier de Nuisances Multi-Días</strong>: Mapas históricos y curvas periódicas',
                '⚖️ <strong>Plantillas de Reclamación Jurídica</strong>: Burofaxes y escritos judiciales',
                '☁️ <strong>Sincronización en la Nube Cifrada</strong>: Copia permanente multidispositivo'
            ],
            'btn': 'Comprar Pro Anual · 24,99 $',
            'account': '¿Ya tiene cuenta? Iniciar sesión'
        },
        'lifetime': {
            'pill': 'Licencia de por Vida',
            'name': 'Acceso Total Permanente',
            'price': '79,99 $',
            'del': '199,00 $',
            'discount': '60% DTO.',
            'hint': 'Pago único · Tranquilidad jurídica continua para inquilinos y propietarios',
            'items': [
                '<strong>Licencia definitiva de propiedad</strong> sin suscripciones recurrentes',
                'Incluye todas las funciones Centinela, Dossier y escritos formales',
                'Sincronización entre dispositivos y almacenamiento cloud permanente',
                'Soporte prioritario y todas las futuras mejoras acústicas incluidas',
                'Disponible en cualquier momento ante ruidos vecinales, obras o comercios'
            ],
            'btn': 'Acceso de por Vida · 79,99 $',
            'account': '¿Ya tiene cuenta? Iniciar sesión'
        },
        'matrix': {
            'th_feature': 'Prestaciones y Características',
            'th_free': 'Básico Gratuito',
            'th_single': 'Informe Único',
            'th_monthly': 'Pro Mensual',
            'th_pro': 'Pro Anual ★',
            'th_lifetime': 'De por Vida',
            'f1_name': 'Monitorización dB en Tiempo Real', 'f1_desc': 'Ponderación A/C, espectro de frecuencias en vivo',
            'f2_name': 'Captura Probatoria de Audio y Foto', 'f2_desc': 'Sello inviolable de fecha, hora y coordenadas GPS',
            'f3_name': 'Exportación PDF Probatoria Oficial', 'f3_desc': 'Sin marcas de agua, listo para comunidades y juzgados',
            'f4_name': 'Huella Criptográfica SHA-256', 'f4_desc': 'Desmonta acusaciones de haber falseado el volumen',
            'f5_name': '🌙 Modo Centinela Nocturno', 'f5_desc': 'Vigilancia de bajo consumo con captura automática por umbral',
            'f6_name': '📊 Dossier de Perturbación Multi-Día', 'f6_desc': 'Curvas de evolución temporal y frecuencia de infracciones',
            'f7_name': '⚖️ Plantillas de Escritos Jurídicos', 'f7_desc': 'Reclamaciones formales, solicitudes de mediación y avisos',
            'f8_name': 'Sincronización y Respaldo Cloud', 'f8_desc': 'Pruebas a salvo aunque cambie de móvil o limpie datos',
            'f9_name': 'Duración del Plan y Precio Promocional', 'f9_desc': 'Tarifas especiales de lanzamiento; vuelven a precios base después'
        }
    ,
        'disclaimer_note': 'SOUNDTEST.PRO es una herramienta de estimación y documentación civil para mediación vecinal, no un sonómetro legalmente certificado. Los procedimientos sancionadores formales requieren mediciones con instrumental calibrado de Clase 1 o 2.'
    },
    'ja': {
        'eyebrow': '料金プラン',
        'title': '日常の簡易測定は完全無料。近隣・管理会社との相談に役立つ詳細ログを必要時にアンロック。',
        'lead': 'ブラウザ上での騒音測定は100%無料です。管理会社への相談や近隣トラブルの記録に、客観的な市民記録レポートを1.99ドルからご利用いただけます。',
        'banner': '初期公開特別キャンペーン：現在早期特別割引価格にてご提供中。キャンペーン終了後は通常価格（単回 4.99ドル / 月額 9.99ドル / 年額 59.99ドル / 永久買切 199ドル）に戻ります。今すぐ特別価格で権利を確保！',
        'free': {
            'pill': '無料体験版',
            'name': 'Web測定ツール',
            'tag': '$0',
            'hint': '音響規格（IEC基準）に基づくリアルタイム測定と騒音基準値の照合',
            'items': [
                'リアルタイム高精度騒音計（A/C特性）',
                '音声録音＆リアルタイム周波数スペクトル波形',
                'GPS位置情報および正確なタイムスタンプ自動記録',
                '個人参考用ウォーターマーク入りプレビュー出力',
                'データはブラウザローカル内のみに安全一時保持'
            ],
            'btn': '無料測定を開始'
        },
        'single': {
            'pill': '単回正式レポート',
            'name': '改ざん防止証拠PDF',
            'price': '$1.99',
            'del': '$4.99',
            'discount': '60% OFF',
            'hint': '1回買い切り · 「音量を故意に上げた」という相手方の言い逃れを完全排除',
            'items': [
                '透かしのない正式な<strong>詳細な民事相談用PDF記録レポート</strong> 1件出力',
                '<strong>SHA-256 電子署名ハッシュ</strong>＆GPS位置情報刻印',
                '公的音響統計指標（LAeq・L10・L90・ピーク値）完全収録',
                '現場写真＋緯度経度付き証拠シート添付',
                '管理会社・大家・警察相談・調停申立に直ちに利用可能'
            ],
            'btn': '単回レポートをアンロック · $1.99'
        },
        'monthly': {
            'pill': 'Pro マンスリー',
            'name': 'Pro 月間権利プラン',
            'price': '$4.99<small style="font-size:13px;color:var(--soft);">/月</small>',
            'del': '$9.99',
            'discount': '50% OFF',
            'hint': '短期賃貸中のトラブル、突発的な解体・リフォーム工事対策に最適',
            'items': [
                '<strong>30日間無制限</strong>で正式証拠PDFレポートを出力可能',
                '🌙 <strong>夜間ノイズ見張り番モード</strong>：基準値超過時に自動記録',
                '📊 <strong>連続騒音被害鑑定ファイル</strong>：30日間の推移グラフ集計',
                '⚖️ <strong>苦情申入・法的通知書テンプレート</strong>：迅速な書面作成',
                '☁️ <strong>暗号化クラウド同期</strong>：端末変更やデータ消去時も証拠を保護'
            ],
            'btn': '月額Proに加入 · $4.99'
        },
        'yearly': {
            'popular': '★ 最も選ばれている人気プラン · 月あたり約2.08ドル',
            'pill': 'Pro 年間プレミアム',
            'name': '長期紛争対策ファイル',
            'price': '$24.99<small style="font-size:13px;color:var(--soft);">/年</small>',
            'del': '$59.99',
            'discount': '35ドルお得',
            'hint': '365日間の自動監視体制 · 手動での見張りや記録ストレスから完全解放',
            'items': [
                '<strong>365日間無制限</strong>で公式証拠PDFレポートを出力可能',
                '🌙 <strong>夜間ノイズ見張り番モード</strong>：深夜の断続的騒音を逃さず自動記録',
                '📊 <strong>連続騒音被害鑑定ファイル</strong>：月単位の騒音推移と頻度マップ',
                '⚖️ <strong>苦情申入・法的通知書テンプレート</strong>：交渉書面を網羅',
                '☁️ <strong>暗号化クラウド同期</strong>：複数端末同期＆長期証拠バックアップ'
            ],
            'btn': '年間Proパスを入手 · $24.99',
            'account': 'アカウントをお持ちですか？ ログイン'
        },
        'lifetime': {
            'pill': '永久ライセンス',
            'name': '買い切り無制限版',
            'price': '$79.99',
            'del': '$199.00',
            'discount': '60% OFF',
            'hint': '1回のお支払いで永久利用 · 更新料やサブスク課金は一切不要',
            'items': [
                '<strong>永久利用ライセンス</strong>：継続的な課金リスクなし',
                '見張り番モード、被害ファイル、法的書面テンプレートを全網羅',
                'マルチデバイス同期＆無制限クラウド証拠保管',
                '優先サポート＆今後のすべての高度機能アップデートを永久無料提供',
                '近隣トラブル、賃貸更新、住環境防衛に生涯備えられます'
            ],
            'btn': '永久ライセンスを購入 · $79.99',
            'account': 'アカウントをお持ちですか？ ログイン'
        },
        'matrix': {
            'th_feature': '機能と提供内容',
            'th_free': '無料簡易版',
            'th_single': '単回正式レポート',
            'th_monthly': 'Pro マンスリー',
            'th_pro': 'Pro 年間プレミアム ★',
            'th_lifetime': '永久ライセンス',
            'f1_name': 'リアルタイム高精度騒音測定', 'f1_desc': 'A/C周波数補正、リアルタイムスペクトル波形表示',
            'f2_name': '現場音声・写真の証拠記録', 'f2_desc': '改ざん不能タイムスタンプ＆GPS座標刻印',
            'f3_name': '公式証拠PDFレポート出力', 'f3_desc': '透かしなし、管理会社・警察・管理会社・大家・調停の参考資料として活用可能',
            'f4_name': 'SHA-256 電子署名ハッシュ', 'f4_desc': '「音量を操作して捏造した」という反論を科学的に論破',
            'f5_name': '🌙 夜間ノイズ見張り番モード', 'f5_desc': '夜通し省電力監視、基準値超過の瞬間を自動キャプチャ',
            'f6_name': '📊 連続騒音被害鑑定ファイル', 'f6_desc': '複数日・月単位の騒音推移と発生頻度分布図を集計',
            'f7_name': '⚖️ 苦情申入・法的通知書テンプレート', 'f7_desc': '管理会社連絡状、内容証明・損害賠償申立書面書式',
            'f8_name': '複数端末同期＆クラウド保存', 'f8_desc': '機種変更やブラウザ消去時も証拠を安全に保護',
            'f9_name': '有効期間および特別価格', 'f9_desc': '初期公開限定の割引価格（期間終了後は通常価格に戻ります）'
        }
    ,
        'disclaimer_note': 'SOUNDTEST.PROは民間調停や自主記録のための民用推定ツールであり、法定計量認定を受けた騒音計ではありません。正式な法的行政手続きには検定合格機器による測定が必要となる場合があります。'
    },
    'ko': {
        'eyebrow': '요금제 및 플랜',
        'title': '실시간 소음 확인은 100% 무료. 임대인·관리사무소 상담을 위한 상세 소음 기록을 필요 시 잠금 해제.',
        'lead': '브라우저 기본 데시벨 측정은 완전 무료입니다. 층간소음 중재 상담 시 활용할 수 있는 객관적인 민간 소음 기록 리포트를 $1.99부터 생성하세요.',
        'banner': '얼리버드 런칭 특별 할인: 현재 조기 출시 특가로 제공 중입니다. 프로모션 종료 후 정가(단건 $4.99 / 월간 $9.99 / 연간 $59.99 / 평생 소장 $199)로 환원됩니다. 지금 영구 할인 혜택을 잡으세요!',
        'free': {
            'pill': '무료 체험판',
            'name': '웹 즉시 측정 도구',
            'tag': '$0',
            'hint': '음향 규격(IEC 및 환경 기준) 기반 실시간 기준치 측정 및 소음 한도 대조',
            'items': [
                '실시간 고정밀 데시벨 측정 (A/C 가중치)',
                '실시간 오디오 녹음 및 주파수 파형 표시',
                '자동 시간 및 GPS 위치 좌표 스탬프',
                '워터마크 포함 미리보기 보고서 (개인 참고용)',
                '브라우저 내부 로컬 임시 저장'
            ],
            'btn': '무료 측정 시작하기'
        },
        'single': {
            'pill': '단건 공식 보고서',
            'name': '위변조 방지 증거 PDF',
            'price': '$1.99',
            'del': '$4.99',
            'discount': '60% 할인',
            'hint': '1회 영구 구매 · "볼륨을 키워 조작했다"는 상대방의 핑계를 원천 차단',
            'items': [
                '워터마크 없는 <strong>공식 법적 증거 PDF 보고서</strong> 1건 출력',
                '<strong>SHA-256 암호화 디지털 지문</strong> 및 GPS 위치 각인',
                '표준 음향 통계 지표 (LAeq, L10, L90, 최대 데시벨)',
                '타임스탬프 현장 사진 및 좌표 증거 시트 첨부',
                '관리사무소, 임대인 통보 또는 경찰·분쟁조정위 제출용'
            ],
            'btn': '단건 보고서 잠금 해제 · $1.99'
        },
        'monthly': {
            'pill': 'Pro 유연한 월간권',
            'name': 'Pro 월간 이용권',
            'price': '$4.99<small style="font-size:13px;color:var(--soft);">/월</small>',
            'del': '$9.99',
            'discount': '50% 할인',
            'hint': '단기 임대차 분쟁, 일시적인 리모델링 및 인테리어 소음 증거 수집에 적합',
            'items': [
                '<strong>30일간 무제한</strong> 정식 위변조 방지 PDF 증거 생성',
                '🌙 <strong>야간 소음 센트리 모드</strong>: 기준치 초과 소음 발생 시 자동 감지 기록',
                '📊 <strong>연속 소음 피해 평가 파일</strong>: 30일간의 음향 추세 그래프 자동 집계',
                '⚖️ <strong>권리구제 및 분쟁 대응 서식 템플릿</strong>: 내용증명 및 사실확인 서식',
                '☁️ <strong>암호화 클라우드 동기화</strong>: 기기 변경이나 캐시 삭제 시에도 증거 영구 보존'
            ],
            'btn': '월간 Pro 시작하기 · $4.99'
        },
        'yearly': {
            'popular': '★ 가장 인기 있는 플랜 · 월 $2.08 수준',
            'pill': 'Pro 연간 프리미엄',
            'name': '장기 분쟁 대응 도시에',
            'price': '$24.99<small style="font-size:13px;color:var(--soft);">/년</small>',
            'del': '$59.99',
            'discount': '$35 절약',
            'hint': '365일 자동 감시 시스템 · 밤낮으로 직접 대기해야 하는 스트레스 해소',
            'items': [
                '<strong>365일 무제한</strong> 정식 위변조 방지 PDF 증거 생성',
                '🌙 <strong>야간 소음 센트리 모드</strong>: 야간 불법 소음 즉시 현장 증거화',
                '📊 <strong>연속 소음 피해 평가 파일</strong>: 수개월간 누적된 소음 빈도 분석',
                '⚖️ <strong>권리구제 및 분쟁 대응 서식 템플릿</strong>: 내용증명 및 법적 문서 양식',
                '☁️ <strong>암호화 클라우드 동기화</strong>: 다중 기기 동기화 및 안전한 백업'
            ],
            'btn': '연간 Pro 패스 받기 · $24.99',
            'account': '이미 계정이 있으신가요? 로그인'
        },
        'lifetime': {
            'pill': '평생 소장 라이선스',
            'name': '영구 무제한 플래그십',
            'price': '$79.99',
            'del': '$199.00',
            'discount': '60% 할인',
            'hint': '단 1회 결제로 평생 소장 · 반복 구독료 없는 영구 안심 권리 확보',
            'items': [
                '<strong>평생 영구 소장 라이선스</strong>: 추가 갱신 비용 제로',
                '센트리 모드, 누적 평가 파일 및 법률 서식 템플릿 전체 포함',
                '다중 기기 실시간 동기화 및 무제한 클라우드 증거 보관소',
                'VIP 우선 지원 및 향후 모든 음향 AI 업데이트 평생 무료 제공',
                '층간소음, 공사소음 등 주거 환경 분쟁 시 언제든 즉시 활용'
            ],
            'btn': '평생 라이선스 구매 · $79.99',
            'account': '이미 계정이 있으신가요? 로그인'
        },
        'matrix': {
            'th_feature': '기능 및 서비스 혜택',
            'th_free': '무료 기본형',
            'th_single': '단건 공식 보고서',
            'th_monthly': 'Pro 월간',
            'th_pro': 'Pro 연간 ★',
            'th_lifetime': '평생 소장',
            'f1_name': '실시간 고정밀 데시벨 모니터링', 'f1_desc': 'A/C 가중치 필터, 실시간 주파수 스펙트럼 파형',
            'f2_name': '현장 음성 및 사진 증거 캡처', 'f2_desc': '위변조 방지 타임스탬프 및 GPS 위치 각인',
            'f3_name': '상세 민간 소음 기록 PDF 내보내기', 'f3_desc': '워터마크 없는 표준 서식으로 관리소 및 중재 상담 자료로 즉시 활용',
            'f4_name': 'SHA-256 암호화 디지털 지문', 'f4_desc': '"볼륨을 키워 조작했다"는 항변을 과학적으로 반박',
            'f5_name': '🌙 야간 소음 센트리 모드', 'f5_desc': '초저전력 밤샘 감시, 기준 초과 순간 자동 캡처 기록',
            'f6_name': '📊 연속 소음 피해 평가 파일', 'f6_desc': '일/월별 소음 추세 및 초과 빈도 분포도 자동 집계',
            'f7_name': '⚖️ 권리구제 분쟁 대응 서식 템플릿', 'f7_desc': '내용증명, 손해배상 청구서, 사실확인 요청 공문 서식',
            'f8_name': '다중 기기 동기화 및 클라우드 보관', 'f8_desc': '기기를 교체하거나 브라우저를 지워도 증거 안전 보존',
            'f9_name': '이용 기간 및 프로모션 가격', 'f9_desc': '신규 런칭 얼리버드 특가 제공 (프로모션 종료 후 정상가 환원)'
        }
    ,
        'disclaimer_note': 'SOUNDTEST.PRO는 일상 분쟁 조정 및 개인 참고를 위한 민간 간이 추정 도구이며, 법적 공인 소음측정기가 아닙니다. 공식적인 법적 절차에는 교정된 전문 계측기를 통한 측정이 필요할 수 있습니다.'
    },
    'vi': {
        'eyebrow': 'Gói &amp; Bảng Giá',
        'title': 'Đo đạc kiểm tra cơ bản hoàn toàn miễn phí. Mở khóa nhật ký âm thanh khách quan phục vụ trao đổi và hòa giải.',
        'lead': 'Đo decibel trên trình duyệt miễn phí 100%. Để hỗ trợ đối thoại với chủ nhà hoặc ban quản lý, mở khóa hồ sơ âm học dân sự có cấu trúc chỉ từ $1.99.',
        'banner': 'Ưu đãi mở bán sớm: Mức giá ưu đãi đặc biệt giai đoạn ra mắt. Sau giai đoạn dùng thử sẽ trở về giá gốc (Đơn lẻ $4.99 / Tháng $9.99 / Năm $59.99 / Trọn đời $199). Đăng ký ngay để giữ giá vĩnh viễn!',
        'free': {
            'pill': 'Bản Miễn Phí',
            'name': 'Đo Ngay Trên Trình Duyệt',
            'tag': '$0',
            'hint': 'Đo lường cơ sở âm học nhanh chóng đối chiếu tiêu chuẩn âm học IEC và ngưỡng giới hạn',
            'items': [
                'Đo decibel thời gian thực (trọng số A/C)',
                'Ghi âm và hiển thị dạng sóng tần số',
                'Đóng dấu thời gian và tọa độ GPS tự động',
                'Báo cáo xem trước có mờ (chỉ dùng tham khảo cá nhân)',
                'Lưu tạm thời trong bộ nhớ đệm trình duyệt'
            ],
            'btn': 'Dùng thử miễn phí'
        },
        'single': {
            'pill': 'Báo Cáo Đơn Lẻ',
            'name': 'Báo Cáo Âm Học Có Cấu Trúc',
            'price': '$1.99',
            'del': '$4.99',
            'discount': 'GIẢM 60%',
            'hint': 'Mua 1 lần dùng vĩnh viễn · Xóa bỏ cáo buộc vặn to âm lượng để làm giả',
            'items': [
                '1 <strong>Báo cáo bằng chứng PDF chính thức không có mờ</strong>',
                '<strong>Dấu vân tay mã hóa SHA-256</strong> &amp; tọa độ GPS',
                'Các chỉ số âm học quy chuẩn (LAeq, L10, L90, dB đỉnh)',
                'Biên bản bằng chứng kèm ảnh hiện trường có dấu thời gian',
                'Hồ sơ chuẩn mực để gửi ban quản lý, chủ nhà hoặc hòa giải'
            ],
            'btn': 'Mở khóa báo cáo · $1.99'
        },
        'monthly': {
            'pill': 'Pro Hàng Tháng',
            'name': 'Gói Truy Cập Tháng',
            'price': '$4.99<small style="font-size:13px;color:var(--soft);">/tháng</small>',
            'del': '$9.99',
            'discount': 'GIẢM 50%',
            'hint': 'Lý tưởng cho các tranh chấp ngắn hạn, thi công cải tạo hoặc thuê nhà',
            'items': [
                '<strong>30 ngày xuất báo cáo PDF không giới hạn</strong> không có mờ',
                '🌙 <strong>Chế độ Sentry Ban Đêm</strong>: Tự động ghi khi tiếng ồn vượt ngưỡng',
                '📊 <strong>Hồ sơ Quấy rối Nhiều Ngày</strong>: Đồ thị xu hướng tổng hợp 30 ngày',
                '⚖️ <strong>Mẫu Đơn Khiếu nại Pháp lý</strong>: Biểu mẫu văn bản quy chuẩn',
                '☁️ <strong>Đồng bộ Đám mây Mã hóa</strong>: Bảo toàn dữ liệu bằng chứng giữa các thiết bị'
            ],
            'btn': 'Đăng ký Pro Tháng · $4.99'
        },
        'yearly': {
            'popular': '★ Lựa Chọn Phổ Biến Nhất · Chỉ ~2.08 $/tháng',
            'pill': 'Pro Cao Cấp Hàng Năm',
            'name': 'Hồ Sơ Tranh Chấp Dài Hạn',
            'price': '$24.99<small style="font-size:13px;color:var(--soft);">/năm</small>',
            'del': '$59.99',
            'discount': 'Tiết kiệm $35',
            'hint': '365 ngày giám sát tự động hóa · Giải phóng khỏi việc theo dõi thủ công',
            'items': [
                '<strong>365 ngày xuất báo cáo PDF bằng chứng không giới hạn</strong>',
                '🌙 <strong>Chế độ Sentry Ban Đêm</strong>: Bắt quả tang vi phạm tiếng ồn lúc nửa đêm',
                '📊 <strong>Hồ sơ Quấy rối Nhiều Ngày</strong>: Tổng hợp biểu đồ xu hướng nhiều tháng',
                '⚖️ <strong>Mẫu Đơn Khiếu nại Pháp lý</strong>: Trọn bộ công văn cho cơ quan chức năng',
                '☁️ <strong>Đồng bộ Đám mây Mã hóa</strong>: Sao lưu vĩnh viễn và đồng bộ nhiều máy'
            ],
            'btn': 'Nhận gói Pro Năm · $24.99',
            'account': 'Đã có tài khoản? Đăng nhập'
        },
        'lifetime': {
            'pill': 'Giấy Phép Trọn Đời',
            'name': 'Toàn Quyền Sở Hữu Vĩnh Viễn',
            'price': '$79.99',
            'del': '$199.00',
            'discount': 'GIẢM 60%',
            'hint': 'Thanh toán 1 lần duy nhất · Yên tâm pháp lý lâu dài, không phát sinh gia hạn',
            'items': [
                '<strong>Giấy phép sở hữu vĩnh viễn</strong> không có phí thuê bao định kỳ',
                'Bao gồm toàn bộ tính năng Sentry, Hồ sơ phân tích và biểu mẫu pháp lý',
                'Đồng bộ đa thiết bị &amp; lưu trữ kho chứng cứ đám mây vĩnh viễn',
                'Ưu tiên hỗ trợ &amp; cập nhật toàn bộ thuật toán âm học trong tương lai',
                'Sẵn sàng bảo vệ quyền lợi cư trú bất cứ khi nào xảy ra tranh chấp'
            ],
            'btn': 'Sở hữu Trọn đời · $79.99',
            'account': 'Đã có tài khoản? Đăng nhập'
        },
        'matrix': {
            'th_feature': 'Tính Năng &amp; Quyền Lợi',
            'th_free': 'Miễn Phí Cơ Bản',
            'th_single': 'Báo Cáo Đơn Lẻ',
            'th_monthly': 'Pro Hàng Tháng',
            'th_pro': 'Pro Hàng Năm ★',
            'th_lifetime': 'Trọn Đời',
            'f1_name': 'Giám sát dB Thời gian thực', 'f1_desc': 'Trọng số A/C, dạng sóng quang phổ thời gian thực',
            'f2_name': 'Thu thập Bằng chứng Âm thanh &amp; Ảnh', 'f2_desc': 'Dấu thời gian chống giả mạo &amp; tọa độ GPS chính xác',
            'f3_name': 'Xuất Báo cáo PDF Pháp lý Chính thức', 'f3_desc': 'Không có mờ, định dạng chuẩn nộp ban quản lý &amp; hòa giải dân sự',
            'f4_name': 'Vân tay Mã hóa SHA-256', 'f4_desc': 'Bác bỏ lập luận gian lận hay tự ý chỉnh âm lượng',
            'f5_name': '🌙 Chế độ Sentry Ban Đêm', 'f5_desc': 'Giám sát ngầm tiết kiệm pin, tự động ghi khi vượt ngưỡng',
            'f6_name': '📊 Hồ sơ Quấy rối Nhiều Ngày', 'f6_desc': 'Tổng hợp xu hướng ngày/tháng &amp; tần suất vượt quy chuẩn',
            'f7_name': '⚖️ Mẫu Đơn Khiếu nại Pháp lý', 'f7_desc': 'Đơn kiến nghị, công văn gửi chủ nhà &amp; biên bản hòa giải',
            'f8_name': 'Đồng bộ Đa thiết bị &amp; Đám mây', 'f8_desc': 'Đổi máy hoặc xóa bộ nhớ đệm cũng không lo mất chứng cứ',
            'f9_name': 'Thời hạn Gói &amp; Giá Ưu đãi', 'f9_desc': 'Giá mở bán sớm; sẽ dần khôi phục về mức giá chuẩn sau đó'
        }
    ,
        'disclaimer_note': 'SOUNDTEST.PRO là công cụ ước tính và lập hồ sơ dân sự phục vụ hòa giải, không phải máy đo độ ồn được chứng nhận theo luật định. Các thủ tục pháp lý chính thức có thể yêu cầu thiết bị đo chuyên dụng đã được kiểm định.'
    },
    'th': {
        'eyebrow': 'แผนและราคา',
        'title': 'วัดระดับเสียงเบื้องต้นฟรี 100% ปลดล็อกบันทึกเสียงและเดซิเบลเชิงวัตถุวิสัยสำหรับการเจรจาไกล่เกลี่ย.',
        'lead': 'การทดสอบระดับเสียงผ่านเบราว์เซอร์ฟรี 100% เมื่อต้องการหลักฐานประกอบการเจรจากับเจ้าของที่พักหรือนิติบุคคล ปลดล็อกรายงานบันทึกข้อมูลเชิงวัตถุวิสัยเริ่มต้นเพียง $1.99.',
        'banner': 'สิทธิพิเศษช่วงเปิดตัว: ราคาพิเศษสำหรับผู้ใช้งานช่วงแรก หลังจากนี้จะปรับกลับเป็นราคาปกติ ($4.99 รายครั้ง / $9.99 รายเดือน / $59.99 รายปี / $199 ตลอดชีพ) ล็อกราคาส่วนลดวันนี้!',
        'free': {
            'pill': 'เวอร์ชันฟรี',
            'name': 'เครื่องมือวัดบนเว็บทันที',
            'tag': '$0',
            'hint': 'การวัดระดับเสียงเบื้องต้นเทียบเคียงกับมาตรฐานอะคูสติก IEC และเกณฑ์เสียงรบกวน',
            'items': [
                'เครื่องวัดเดซิเบลแบบเรียลไทม์ (A/C weighting)',
                'บันทึกเสียงและแสดงกราฟคลื่นเสียงตามเวลาจริง',
                'ประทับเวลาและพิกัดตำแหน่ง GPS อัตโนมัติ',
                'รายงานตัวอย่างติดลายน้ำ (สำหรับใช้อ้างอิงส่วนบุคคล)',
                'จัดเก็บชั่วคราวในแคชเบราว์เซอร์บนอุปกรณ์ของคุณ'
            ],
            'btn': 'เริ่มทดลองใช้งานฟรี'
        },
        'single': {
            'pill': 'รายงานแบบรายครั้ง',
            'name': 'รายงานหลักฐานทางการ',
            'price': '$1.99',
            'del': '$4.99',
            'discount': 'ลด 60%',
            'hint': 'ซื้อครั้งเดียวใช้งานได้ทันที · ขจัดข้อโต้แย้งเรื่องการแกล้งเร่งเสียงเพื่อจัดฉาก',
            'items': [
                'ส่งออก <strong>รายงานหลักฐาน PDF ทางการไม่มีลายน้ำ</strong> 1 ฉบับ',
                '<strong>ลายนิ้วมือดิจิทัล SHA-256</strong> พร้อมประทับพิกัด GPS',
                'ดัชนีทางอะคูสติกตามมาตรฐาน (LAeq, L10, L90, ค่าเดซิเบลสูงสุด)',
                'แนบภาพถ่ายหลักฐานในสถานที่จริงพร้อมพิกัดเวลา',
                'เอกสารหลักฐานพร้อมยื่นต่อนิติบุคคล ผู้ให้เช่า หรือใช้ไกล่เกลี่ย'
            ],
            'btn': 'ปลดล็อกรายงานเดี่ยว · $1.99'
        },
        'monthly': {
            'pill': 'Pro รายเดือน',
            'name': 'สิทธิ์การใช้งาน Pro รายเดือน',
            'price': '$4.99<small style="font-size:13px;color:var(--soft);">/เดือน</small>',
            'del': '$9.99',
            'discount': 'ลด 50%',
            'hint': 'เหมาะสำหรับการเช่าระยะสั้น งานก่อสร้างปรับปรุงชั่วคราว หรือรวบรวมหลักฐานเร่งด่วน',
            'items': [
                '<strong>ส่งออกรายงาน PDF ทางการไม่จำกัด</strong> ในระยะเวลา 30 วัน',
                '🌙 <strong>โหมดเซนทรีเฝ้าระวังยามค่ำคืน</strong>: บันทึกอัตโนมัติเมื่อเสียงเกินเกณฑ์',
                '📊 <strong>แฟ้มประเมินความเดือดร้อนต่อเนื่อง</strong>: กราฟแนวโน้มเสียง 30 วัน',
                '⚖️ <strong>เทมเพลตหนังสือร้องเรียนทางกฎหมาย</strong>: จัดทำหนังสือแจ้งอย่างเป็นทางการ',
                '☁️ <strong>การซิงค์คลาวด์เข้ารหัส</strong>: เก็บรักษาหลักฐานปลอดภัยข้ามอุปกรณ์'
            ],
            'btn': 'สมัคร Pro รายเดือน · $4.99'
        },
        'yearly': {
            'popular': '★ แผนยอดนิยมสูงสุด · เพียง ~$2.08/เดือน',
            'pill': 'Pro รายปีพรีเมียม',
            'name': 'แฟ้มหลักฐานข้อพิพาทระยะยาว',
            'price': '$24.99<small style="font-size:13px;color:var(--soft);">/ปี</small>',
            'del': '$59.99',
            'discount': 'ประหยัด $35',
            'hint': 'เฝ้าระวังอัตโนมัติตลอด 365 วัน · ปลดเปลื้องความเหนื่อยล้าในการเฝ้าบันทึกด้วยตนเอง',
            'items': [
                '<strong>ส่งออกรายงาน PDF ทางการไม่จำกัด</strong> ตลอด 365 วัน',
                '🌙 <strong>โหมดเซนทรีเฝ้าระวังยามค่ำคืน</strong>: บันทึกเหตุการณ์เสียงดังยามวิกาลอัตโนมัติ',
                '📊 <strong>แฟ้มประเมินความเดือดร้อนต่อเนื่อง</strong>: กราฟวิเคราะห์แนวโน้มข้ามเดือน',
                '⚖️ <strong>เทมเพลตหนังสือร้องเรียนทางกฎหมาย</strong>: แบบฟอร์มสำหรับนิติและเจ้าหน้าที่',
                '☁️ <strong>การซิงค์คลาวด์เข้ารหัส</strong>: สำรองข้อมูลถาวรและซิงค์ใช้งานหลายเครื่อง'
            ],
            'btn': 'รับสิทธิ์ Pro รายปี · $24.99',
            'account': 'มีบัญชีอยู่แล้ว? เข้าสู่ระบบ'
        },
        'lifetime': {
            'pill': 'ใบอนุญาตตลอดชีพ',
            'name': 'สิทธิ์การเข้าถึงถาวรไร้ขีดจำกัด',
            'price': '$79.99',
            'del': '$199.00',
            'discount': 'ลด 60%',
            'hint': 'ชำระเพียงครั้งเดียวใช้งานได้ตลอดชีพ · อุ่นใจไร้กังวลเรื่องค่าบริการรายเดือน',
            'items': [
                '<strong>สิทธิ์ความเป็นเจ้าของถาวร</strong> โดยไม่มีค่าธรรมเนียมสมัครสมาชิกรายเดือน',
                'ครอบคลุมฟังก์ชันเซนทรี แฟ้มประเมินต่อเนื่อง และเทมเพลตทางกฎหมายครบครัน',
                'ซิงค์ข้อมูลข้ามอุปกรณ์และพื้นที่จัดเก็บหลักฐานบนคลาวด์ถาวร',
                'บริการช่วยเหลือระดับ VIP และอัปเดตระบบเสียงทั้งหมดในอนาคตฟรีตลอดชีพ',
                'พร้อมใช้งานปกป้องสิทธิ์ในการอยู่อาศัยของคุณได้ทุกเมื่อ'
            ],
            'btn': 'ซื้อสิทธิ์ตลอดชีพ · $79.99',
            'account': 'มีบัญชีอยู่แล้ว? เข้าสู่ระบบ'
        },
        'matrix': {
            'th_feature': 'ฟังก์ชันและสิทธิประโยชน์',
            'th_free': 'เวอร์ชันฟรีพื้นฐาน',
            'th_single': 'รายงานแบบรายครั้ง',
            'th_monthly': 'Pro รายเดือน',
            'th_pro': 'Pro รายปี ★',
            'th_lifetime': 'ตลอดชีพ',
            'f1_name': 'การวัดระดับเดซิเบลแบบเรียลไทม์', 'f1_desc': 'A/C weighting, กราฟคลื่นความถี่เสียงแบบเรียลไทม์',
            'f2_name': 'บันทึกภาพถ่ายและเสียงเป็นหลักฐาน', 'f2_desc': 'ประทับเวลาและพิกัด GPS ป้องกันการแก้ไขดัดแปลง',
            'f3_name': 'ส่งออกรายงานหลักฐาน PDF ทางการ', 'f3_desc': 'ไร้ลายน้ำ พร้อมยื่นต่อนิติบุคคล เจ้าหน้าที่ หรือชั้นศาล',
            'f4_name': 'ลายนิ้วมือดิจิทัลเข้ารหัส SHA-256', 'f4_desc': 'หักล้างข้ออ้างของอีกฝ่ายเรื่องการแกล้งเร่งเสียงจัดฉาก',
            'f5_name': '🌙 โหมดเซนทรีเฝ้าระวังยามค่ำคืน', 'f5_desc': 'เฝ้าระวังพื้นหลังแบบประหยัดพลังงาน บันทึกอัตโนมัติเมื่อเกินเกณฑ์',
            'f6_name': '📊 แฟ้มประเมินความเดือดร้อนต่อเนื่อง', 'f6_desc': 'รวบรวมแนวโน้มเสียงและสถิติความถี่ที่เกินมาตรฐาน',
            'f7_name': '⚖️ เทมเพลตหนังสือร้องเรียนทางกฎหมาย', 'f7_desc': 'หนังสือแจ้งเตือน ข้อเรียกร้องนิติบุคคล และเอกสารไกล่เกลี่ย',
            'f8_name': 'การซิงค์หลายอุปกรณ์และสำรองบนคลาวด์', 'f8_desc': 'หลักฐานไม่สูญหายแม้จะเปลี่ยนโทรศัพท์หรือล้างแคช',
            'f9_name': 'ระยะเวลาและราคาโปรโมชัน', 'f9_desc': 'ราคาพิเศษสำหรับผู้ใช้ช่วงแรก (จะปรับเป็นราคาปกติในภายหลัง)'
        }
    ,
        'disclaimer_note': 'SOUNDTEST.PRO เป็นเครื่องมือบันทึกและประเมินระดับบุคคลสำหรับการไกล่เกลี่ยข้อพิพาท ไม่ใช่เครื่องวัดระดับเสียงที่ได้รับการรับรองตามกฎหมาย กระบวนการทางกฎหมายอย่างเป็นทางการอาจต้องใช้การตรวจวัดด้วยเครื่องมือที่ผ่านการสอบเทียบ'
    }
}

def generate_pricing_section(d):
    f = d['free']
    s = d['single']
    m = d['monthly']
    y = d['yearly']
    l = d['lifetime']
    mx = d['matrix']

    f_items = "".join(f"            <li>{it}</li>\n" for it in f['items'])
    s_items = "".join(f"            <li>{it}</li>\n" for it in s['items'])
    m_items = "".join(f"            <li>{it}</li>\n" for it in m['items'])
    y_items = "".join(f"            <li>{it}</li>\n" for it in y['items'])
    l_items = "".join(f"            <li>{it}</li>\n" for it in l['items'])

    return f"""    <section class="section" id="pricing">
      <div class="section-header reveal">
        <span class="eyebrow">{d['eyebrow']}</span>
        <h2>{d['title']}</h2>
        <p class="lead">{d['lead']}</p>
      </div>

      <div class="launch-discount-banner reveal">
        <span class="fire">🔥</span>
        <span>{d['banner']}</span>
      </div>

      <div class="pricing-row">
        <!-- Free Tier -->
        <div class="price-card reveal">
          <span class="price-pill">{f['pill']}</span>
          <span class="price-name">{f['name']}</span>
          <div class="price-tag">{f['tag']}</div>
          <div class="price-compare-hint">{f['hint']}</div>
          <ul class="check-list">
{f_items}          </ul>
          <a class="button" href="../soundtest.html">{f['btn']}</a>
        </div>

        <!-- Single Official Report -->
        <div class="price-card single-report reveal">
          <div class="price-card-img" style="border-radius:8px;overflow:hidden;margin:0 0 10px;max-height:100px;">
            <img src="../assets/images/forensic_report_preview.webp" alt="Official forensic PDF vs watermarked preview comparison" loading="lazy" style="width:100%;height:100px;object-fit:cover;object-position:center top;display:block;">
          </div>
          <span class="price-pill">{s['pill']}</span>
          <span class="price-name">{s['name']}</span>
          <div class="price-tag">
            <del class="price-del">{s['del']}</del>{s['price']}
            <span class="price-discount-tag">{s['discount']}</span>
          </div>
          <div class="price-compare-hint">{s['hint']}</div>
          <ul class="check-list">
{s_items}          </ul>
          <a class="button" href="{URL_SINGLE}" target="_blank" rel="noopener">{s['btn']}</a>
        </div>

        <!-- Pro Monthly -->
        <div class="price-card monthly reveal">
          <span class="price-pill">{m['pill']}</span>
          <span class="price-name">{m['name']}</span>
          <div class="price-tag">
            <del class="price-del">{m['del']}</del>{m['price']}
            <span class="price-discount-tag" style="background:rgba(124,155,255,0.2);color:#7c9bff;border-color:rgba(124,155,255,0.4);">{m['discount']}</span>
          </div>
          <div class="price-compare-hint">{m['hint']}</div>
          <ul class="check-list">
{m_items}          </ul>
          <a class="button" href="{URL_MONTHLY}" target="_blank" rel="noopener" style="border-color:rgba(124,155,255,0.45);background:linear-gradient(135deg,rgba(124,155,255,0.2),rgba(255,255,255,0.04));color:#a5b4fc;font-weight:750;">{m['btn']}</a>
        </div>

        <!-- Pro Yearly (Recommended) -->
        <div class="price-card pro reveal">
          <div class="price-card-img" style="border-radius:8px;overflow:hidden;margin:0 0 10px;max-height:100px;">
            <img src="../assets/images/sentry_night_monitor.webp" alt="Overnight Sentry Mode illustration" loading="lazy" style="width:100%;height:100px;object-fit:cover;object-position:center 40%;display:block;">
          </div>
          <span class="price-badge-popular">{y['popular']}</span>
          <span class="price-pill">{y['pill']}</span>
          <span class="price-name">{y['name']}</span>
          <div class="price-tag">
            <del class="price-del">{y['del']}</del>{y['price']}
            <span class="price-discount-tag" style="background:rgba(44,240,193,0.2);color:#2cf0c1;border-color:rgba(44,240,193,0.5);">{y['discount']}</span>
          </div>
          <div class="price-compare-hint">{y['hint']}</div>
          <ul class="check-list">
{y_items}          </ul>
          <a class="button primary" href="{URL_YEARLY}" target="_blank" rel="noopener">{y['btn']}</a>
          <a class="button-link" href="auth.html" style="margin-top:6px;font-size:12px;">{y['account']}</a>
        </div>

        <!-- Lifetime License -->
        <div class="price-card lifetime reveal">
          <span class="price-pill">{l['pill']}</span>
          <span class="price-name">{l['name']}</span>
          <div class="price-tag">
            <del class="price-del">{l['del']}</del>{l['price']}
            <span class="price-discount-tag">{l['discount']}</span>
          </div>
          <div class="price-compare-hint">{l['hint']}</div>
          <ul class="check-list">
{l_items}          </ul>
          <a class="button" href="{URL_LIFETIME}" target="_blank" rel="noopener" style="border-color:rgba(245,158,11,0.5);background:linear-gradient(135deg,rgba(245,158,11,0.2),rgba(255,255,255,0.04));color:#fbbf24;font-weight:800;">{l['btn']}</a>
          <a class="button-link" href="auth.html" style="margin-top:6px;font-size:12px;">{l['account']}</a>
        </div>
      </div>

      <!-- Full Feature Comparison Matrix -->
      <div class="pricing-matrix-wrap reveal">
        <table class="pricing-matrix">
          <thead>
            <tr>
              <th style="width: 25%;">{mx['th_feature']}</th>
              <th style="width: 15%;">{mx['th_free']}</th>
              <th style="width: 15%;">{mx['th_single']}</th>
              <th style="width: 15%;" class="col-monthly">{mx['th_monthly']}</th>
              <th style="width: 15%;" class="col-pro">{mx['th_pro']}</th>
              <th style="width: 15%;" class="col-lifetime">{mx['th_lifetime']}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="feature-name">{mx['f1_name']}<span class="feature-desc">{mx['f1_desc']}</span></td>
              <td><span class="check-yes">✔</span></td>
              <td><span class="check-yes">✔</span></td>
              <td class="col-monthly"><span class="check-yes">✔</span></td>
              <td class="col-pro"><span class="check-yes">✔</span></td>
              <td class="col-lifetime"><span class="check-yes">✔</span></td>
            </tr>
            <tr>
              <td class="feature-name">{mx['f2_name']}<span class="feature-desc">{mx['f2_desc']}</span></td>
              <td><span class="check-yes">✔</span></td>
              <td><span class="check-yes">✔</span></td>
              <td class="col-monthly"><span class="check-yes">✔</span></td>
              <td class="col-pro"><span class="check-yes">✔</span></td>
              <td class="col-lifetime"><span class="check-yes">✔</span></td>
            </tr>
            <tr>
              <td class="feature-name">{mx['f3_name']}<span class="feature-desc">{mx['f3_desc']}</span></td>
              <td><span class="check-no">✖</span></td>
              <td><span class="check-yes">✔ 1</span></td>
              <td class="col-monthly"><span class="check-yes">✔ 30d</span></td>
              <td class="col-pro"><span class="check-yes">✔ 365d</span></td>
              <td class="col-lifetime"><span class="check-yes">✔ ∞</span></td>
            </tr>
            <tr>
              <td class="feature-name">{mx['f4_name']}<span class="feature-desc">{mx['f4_desc']}</span></td>
              <td><span class="check-no">✖</span></td>
              <td><span class="check-yes">✔</span></td>
              <td class="col-monthly"><span class="check-yes">✔</span></td>
              <td class="col-pro"><span class="check-yes">✔</span></td>
              <td class="col-lifetime"><span class="check-yes">✔</span></td>
            </tr>
            <tr>
              <td class="feature-name">{mx['f5_name']}<span class="feature-desc">{mx['f5_desc']}</span></td>
              <td><span class="check-no">✖</span></td>
              <td><span class="check-no">✖</span></td>
              <td class="col-monthly"><span class="check-yes">✔</span></td>
              <td class="col-pro"><span class="check-yes">✔</span></td>
              <td class="col-lifetime"><span class="check-yes">✔</span></td>
            </tr>
            <tr>
              <td class="feature-name">{mx['f6_name']}<span class="feature-desc">{mx['f6_desc']}</span></td>
              <td><span class="check-no">✖</span></td>
              <td><span class="check-no">✖</span></td>
              <td class="col-monthly"><span class="check-yes">✔</span></td>
              <td class="col-pro"><span class="check-yes">✔</span></td>
              <td class="col-lifetime"><span class="check-yes">✔</span></td>
            </tr>
            <tr>
              <td class="feature-name">{mx['f7_name']}<span class="feature-desc">{mx['f7_desc']}</span></td>
              <td><span class="check-no">✖</span></td>
              <td><span class="check-no">✖</span></td>
              <td class="col-monthly"><span class="check-yes">✔</span></td>
              <td class="col-pro"><span class="check-yes">✔</span></td>
              <td class="col-lifetime"><span class="check-yes">✔</span></td>
            </tr>
            <tr>
              <td class="feature-name">{mx['f8_name']}<span class="feature-desc">{mx['f8_desc']}</span></td>
              <td><span class="check-no">✖</span></td>
              <td><span class="check-no">✖</span></td>
              <td class="col-monthly"><span class="check-yes">✔ 30d</span></td>
              <td class="col-pro"><span class="check-yes">✔ 365d</span></td>
              <td class="col-lifetime"><span class="check-yes">✔ ∞</span></td>
            </tr>
            <tr>
              <td class="feature-name">{mx['f9_name']}<span class="feature-desc">{mx['f9_desc']}</span></td>
              <td><strong>{f['tag']}</strong></td>
              <td><strong>{s['price']}</strong> <del style="color:var(--soft);font-size:12px;">{s['del']}</del></td>
              <td class="col-monthly"><strong>{m['price']}</strong> <del style="color:var(--soft);font-size:12px;">{m['del']}</del></td>
              <td class="col-pro"><strong>{y['price']}</strong> <del style="color:var(--soft);font-size:12px;">{y['del']}</del></td>
              <td class="col-lifetime"><strong>{l['price']}</strong> <del style="color:var(--soft);font-size:12px;">{l['del']}</del></td>
            </tr>
          </tbody>
        </table>
        <p class="muted" style="margin-top:1.5rem; font-size:13px; text-align:center;">{d['disclaimer_note']}</p>
      </div>
    </section>"""

for loc, d in SECTIONS.items():
    file_path = os.path.join(ROOT, loc, 'index.html')
    if not os.path.exists(file_path):
        print(f"[{loc}] Not found: {file_path}")
        continue
    with open(file_path, 'r', encoding='utf-8') as f:
        html = f.read()

    # Match existing <section class="section" id="pricing">...</section>
    p = r'(<section class="section" id="pricing">[\s\S]*?</section>)'
    if not re.search(p, html):
        print(f"[{loc}] Pricing section regex did not match!")
        continue

    new_section = generate_pricing_section(d)
    html = re.sub(p, new_section, html, count=1)

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(html)
    print(f"[{loc}] Successfully upgraded pricing section!")

print("All pricing sections synced successfully!")
