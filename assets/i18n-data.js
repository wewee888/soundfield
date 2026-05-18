/**
 * SOUNDTEST.PRO — Internationalization Data
 * Shared translation data for all 9 supported locales.
 * Loaded synchronously before soundtest.html inline scripts.
 * Usage: window.__sfI18N is set by this file, then referenced as `I18N` in soundtest.html.
 */
(function () {
  'use strict';

  const SUPPORTED_APP_LANGUAGES = [
    {value:'en-US',primary:'en',flag:'🇺🇸',label:'English'},
    {value:'zh-CN',primary:'zh',flag:'🇨🇳',label:'中文'},
    {value:'es',primary:'es',flag:'🇪🇸',label:'Español'},
    {value:'fr',primary:'fr',flag:'🇫🇷',label:'Français'},
    {value:'de',primary:'de',flag:'🇩🇪',label:'Deutsch'},
    {value:'ja',primary:'ja',flag:'🇯🇵',label:'日本語'},
    {value:'ko',primary:'ko',flag:'🇰🇷',label:'한국어'},
    {value:'vi',primary:'vi',flag:'🇻🇳',label:'Tiếng Việt'},
    {value:'th',primary:'th',flag:'🇹🇭',label:'ไทย'},
  ];

  const I18N_DATA = {
    'zh-CN':{
      locale:'zh-CN',
      title:'SOUNDTEST.PRO · 声学证据与环境噪声记录',
      metaDescription:'SOUNDTEST.PRO 是面向居民投诉、物业协同、施工巡检和企业环境管理的专业噪声记录工具，支持实时分贝、地点标注、声学证据照片、录音录像和 PDF/CSV 报告导出。',
      storeListing:'SOUNDTEST.PRO 是一款面向居民投诉、物业协同、施工巡检、企业环境管理和个人专业测评的噪声记录工具。适合邻里噪音取证、装修施工噪音记录、物业投诉处理、办公室与工厂噪声巡检、学校/医院/酒店等安静环境管理，以及看房、家电、车内噪音和设备评测。应用支持实时分贝、dBA/dBZ、Fast/Slow、LAeq、地点标注、声学证据照片、录音录像、PDF/CSV 报告导出和用户校准。环境记录与证据辅助，正式检测请以经检定声级计复核为准。',
      levels:{quiet:'安静',moderate:'适中',loud:'嘈杂',danger:'危险'},
      time:{fast:'快响应',slow:'慢响应'},
      camera:{preview:'预览模式',photo:'拍照模式',video:'录像模式',pending:'声级待测',placePending:'位置待获取'},
      modes:{
        cardLabel:'证据模式',
        audio:{label:'录音模式',short:'录音',tagline:'低耗电，保存声音证据',title:'录音模式',desc:'用于长时间记录噪声，耗电最低；点击主按钮后会先启动监测并保存录音。',primary:'开始录音',stop:'停止录音并保存'},
        video:{label:'录像模式',short:'录像',tagline:'画面 + 麦克风同步保存',title:'取证录像',desc:'用于保存现场画面、麦克风声音和烧录水印；摄像头预览打开后，可在预览卡片下方直接关闭。',primary:'开始取证录像',stop:'停止并保存'},
        photo:{label:'照片模式',short:'照片',tagline:'生成带分贝和地址照片',title:'照片模式',desc:'用于快速生成带分贝、GPS、地址和设备信息的证据照片。',primary:'拍照取证',stop:'拍照取证'},
        locationAction:'获取/刷新地址',
        recordsAction:'查看记录',
        cameraCloseHint:'摄像头打开后，可在这里直接关闭预览。',
        closeCamera:'关闭摄像头',
        watermarkTitle:'取证相机',
        watermarkSubtitle:'保存视频已烧录声级、时间、地址和 GPS',
        back:'返回',
        closeCameraShort:'关摄像头',
        snapshotShort:'拍照',
        refreshAddress:'刷新地址',
        recordsShort:'记录',
        monitoringOn:'监测中',
        monitoringOff:'未监测',
        recordingOn:'录制中',
        recordingOff:'未录制',
        calibrationPrefix:'设备/校准',
      },
      reportTemplates:{
        complaint:{title:'Noise Complaint Evidence Report',label:'投诉沟通',purpose:'For resident communication, property feedback, and preliminary complaint records.'},
        property:{title:'Property Noise Coordination Report',label:'物业协同',purpose:'For property management coordination and site follow-up.'},
        inspection:{title:'Workplace Noise Inspection Report',label:'企业巡检',purpose:'For routine environmental inspection and internal records.'},
        legal:{title:'Acoustic Evidence Aid Report',label:'律师沟通辅助',purpose:'For evidence organization and legal communication aid, not formal metrology.'},
        neighbor:{title:'Neighbor Noise Evidence Report',label:'邻里扰民',purpose:'For documenting repeated neighbor noise, night disturbance, impact sounds, and mediation materials.',guidance:'建议记录发生时段、持续时间、楼栋/楼层/房间、手动噪声标记和 L10/L90 对比。'},
        renovation:{title:'Renovation Construction Noise Report',label:'装修施工',purpose:'For documenting renovation or construction noise, site communication, and property follow-up.',guidance:'建议在施工开始、峰值阶段和停止后各记录一段，保留施工位置、时间段和峰值事件。'},
        elevator:{title:'Elevator Machine Room Low-Frequency Report',label:'电梯机房',purpose:'For elevator machine room, shaft, pump, and low-frequency equipment noise review.',guidance:'建议使用 C/Z 计权和 1/3 倍频程，重点观察 31.5-200 Hz 低频段。'},
        ktv:{title:'Retail or KTV Disturbance Report',label:'商铺/KTV',purpose:'For retail, KTV, bar, restaurant, and entertainment venue disturbance documentation.',guidance:'建议夜间多段记录，保留室内测点、窗户状态、L5/L10 峰值和连续背景声。'},
        hvac:{title:'Outdoor AC Unit Noise Report',label:'空调外机',purpose:'For HVAC outdoor unit, fan, compressor, and tonal noise documentation.',guidance:'建议记录开机、稳定运行和停机前后，结合频谱判断低频或高频啸叫。'},
        boundary:{title:'Factory Boundary Noise Report',label:'厂界噪声',purpose:'For preliminary factory boundary or workplace environmental noise documentation.',guidance:'建议记录测点、边界方向、时间段、气象/门窗状态，并保留非认证测量声明。'},
      },
      reportFields:{details:'Session Details',template:'Template',organization:'Organization',purpose:'Purpose',recorded:'Recorded',duration:'Duration',place:'Place',gps:'GPS',weighting:'Weighting',calibration:'Calibration',avg:'Avg',peak:'Peak',min:'Min',media:'Media',note:'Note',trend:'Trend',reference:'Reference',footer:'环境记录与证据辅助，正式检测请以经检定声级计复核为准。'},
      summary:{subtitle:'PROFESSIONAL ACOUSTIC FIELD REPORT',avgLine:'平均声级 · {level} · 环境记录摘要',peak:'最高',min:'最低',duration:'时长',trend:'声级趋势',metadata:'证据元数据',calibration:'校准偏移：{offset} dB · 麦克风增益：{gain} dB',footer:'说明：环境记录与证据辅助，正式检测请以经检定声级计复核为准。'},
      ui:{
        ready:'就绪',monitoring:'监测中',recording:'录制中',localMeter:'本地专业声级计',permissionHint:'点击下方"开始监测"按钮后，浏览器会请求麦克风权限。',upgradeTitle:'升级 Pro：免广告并解锁高级证据能力',upgradeDesc:'去广告、批量 PDF、证据模板、校准档案、长时录制和云备份预留。',viewBenefits:'查看权益',manageBenefits:'管理权益',start:'开始监测',stop:'停止监测',peak:'峰值',min:'最小',duration:'时长',avg:'平均',quiet:'安静',moderate:'中等',loud:'嘈杂',wave:'波形',spectrum:'频谱',trend:'趋势',reference:'声级参考',quickScene:'一键场景',quickSceneHint:'点击标签一键填入备注并匹配报告模板',upgradePro:'升级 Pro',dataProcessedLocally:'本地处理数据',evidenceLibrary:'尽调库',recordStatus:'录制状态',notRecording:'未录制',startVideo:'开始录像（含麦克风）',cameraPreview:'摄像头预览',cameraOpen:'点击打开摄像头',cameraOpenSub:'用于预览、拍照取证和录像画面',photoEvidence:'拍照取证',video:'录像',preview:'预览',photoMode:'拍照模式',videoMode:'录像模式',cameraHint:'声学取证相机：可先打开摄像头预览，开始监测后拍照会叠加分贝、GPS 和地点信息。',openPhoto:'打开声学证据照片',gps:'GPS 位置',noLocation:'尚未获取',placeNotStarted:'地点识别未开始',savePlace:'保存地点',rerunPlace:'重新识别',shareTitle:'推荐 SOUNDTEST.PRO 给需要噪声证据的人',shareDesc:'分享应用入口或当前报告摘要；默认不分享精确坐标，保护用户隐私。',share:'推荐分享',recordTools:'记录工具',recordToolsDesc:'从这里开始录制、导出全部记录，或清空本机证据数据。没有记录时也可以直接跳转到监测页。',startRecord:'开始录制',exportCsv:'导出 CSV',exportPdf:'导出 PDF',clearRecords:'清空记录',noRecords:'暂无录音记录',sessions:'会话',mean:'均值',mapTools:'地图工具',mapToolsDesc:'地图基于已保存记录的 GPS 坐标绘制；可导出图片，或把最新记录打开到外部地图。',refreshMap:'刷新地图',exportMap:'导出地图图片',openLatestLocation:'打开最新位置',backMonitor:'返回监测',noiseMap:'噪音分布地图',geoSessions:'带坐标的会话',noGeoRecords:'尚无带 GPS 的记录。',settings:'测量设置',languageLabel:'语言 / Language',languageDesc:'默认跟随系统，也可以手动切换官网支持的 9 种语言。',frequencyWeighting:'频率计权',frequencyDesc:'A 计权贴近人耳感知，法规常用 dBA',timeWeighting:'时间计权',timeDesc:'快响应用于瞬态，慢响应用于稳态',fastShort:'快',slowShort:'慢',advancedCalibration:'高级校准',advancedDesc:'不同手机麦克风灵敏度、频响和系统音频处理差异很大。普通用户不建议自行调整；随意调整后，证据解释价值会下降，报告也必须保留校准参数。',enterAdvanced:'点击进入此设置',alertThreshold:'告警阈值',alertDesc:'超过此分贝值触发警告',enableAlert:'启用告警',placeLookup:'地点识别',placeLookupDesc:'定位后识别小区、道路或附近地点；会把坐标发送给地图服务。',smoothing:'波形平滑',about:'说明',accuracy:'精度',accuracyDesc:'环境记录与证据辅助，正式检测请以经检定声级计复核为准。',version:'版本',privacy:'隐私与合规',feedback:'用户反馈与报错',subscription:'订阅权益',reportTemplate:'报告模板',templateType:'模板类型',templateDesc:'根据使用场景调整 PDF 标题、用途说明和报告语气。',organization:'组织/项目名',organizationDesc:'会显示在 PDF 报告中，可填写小区、公司、项目或客户名。',storeAssets:'应用商店素材',copyStore:'复制上架简介',data:'数据',monitor:'监测',records:'记录',map:'地图'},
      placeholders:{note:'添加备注（如：施工现场旁、夜间路边）',place:'手动填写小区/地点名',search:'搜索备注、坐标...',feedback:'请描述你遇到的问题、手机型号/浏览器、复现步骤，或希望增加的功能。',organization:'可选'},
      messages:{languageSaved:'语言已切换为中文。',copyStoreEmpty:'暂无可复制的上架简介。',storeCopied:'应用商店简介已复制。',clipboardUnsupported:'当前浏览器不支持剪贴板复制，请手动选中文字。',summaryDownloaded:'本次监测摘要图已生成并下载。',pdfMissing:'PDF 组件未加载完成，请检查网络后重试。',noRecords:'暂无记录。'},
      media:{audio:'录音',video:'视频',none:'无媒体'},
      reference:[['0-49 dB','安静','图书馆、卧室'],['50-69 dB','适中','办公室、交谈'],['70-84 dB','嘈杂','交通、街道'],['85+ dB','危险','存在听力损伤风险']],
    },
    'en-US':{
      locale:'en-US',
      title:'SOUNDTEST.PRO · Field Noise Evidence Recorder',
      metaDescription:'SOUNDTEST.PRO helps document environmental noise with live dB readings, location tags, evidence photos, video, and PDF/CSV reports.',
      storeListing:'SOUNDTEST.PRO is a field-ready noise documentation tool for neighbor noise, renovation and construction work, property complaints, workplace inspections, quiet-space management, and equipment reviews. Capture live dB readings, dBA/dBC/dBZ weighting, Fast/Slow response, LAeq, location labels, evidence photos, audio/video, PDF/CSV reports, and calibration notes. For environmental documentation and evidence support only; formal measurements should be verified with a certified sound level meter.',
      levels:{quiet:'Quiet',moderate:'Moderate',loud:'Loud',danger:'Hazardous'},
      time:{fast:'Fast response',slow:'Slow response'},
      camera:{preview:'Preview',photo:'Photo',video:'Video',pending:'Waiting for reading',placePending:'Location needed'},
      modes:{
        cardLabel:'Evidence mode',
        audio:{label:'Audio',short:'Audio',tagline:'Low-power audio log',title:'Audio mode',desc:'Best for long sessions. Uses the mic only and keeps power use low.',primary:'Start audio',stop:'Stop & save'},
        video:{label:'Video',short:'Video',tagline:'Video + microphone',title:'Evidence video',desc:'Capture the scene, microphone audio, and burned-in evidence watermark in the full-screen camera.',primary:'Start evidence video',stop:'Stop & save'},
        photo:{label:'Photo',short:'Photo',tagline:'dB-stamped photo',title:'Photo mode',desc:'Capture a photo with dB, GPS, address, and calibration details.',primary:'Capture photo',stop:'Capture photo'},
        locationAction:'Update address',
        recordsAction:'Records',
        cameraCloseHint:'Close the camera here when you are done.',
        closeCamera:'Close camera',
        watermarkTitle:'Evidence Camera',
        watermarkSubtitle:'Saved video includes dB, time, address, and GPS',
        back:'Back',
        closeCameraShort:'Close camera',
        snapshotShort:'Photo',
        refreshAddress:'Address',
        recordsShort:'Records',
        monitoringOn:'Monitoring',
        monitoringOff:'Idle',
        recordingOn:'Recording',
        recordingOff:'Not recording',
        calibrationPrefix:'Device & calibration',
      },
      reportTemplates:{
        complaint:{title:'Noise Complaint Evidence Report',label:'Complaint',purpose:'For tenant communication, property management follow-up, and early complaint records.'},
        property:{title:'Property Noise Coordination Report',label:'Property coordination',purpose:'For property management coordination and on-site follow-up.'},
        inspection:{title:'Workplace Noise Inspection Report',label:'Inspection',purpose:'For routine environmental checks and internal records.'},
        legal:{title:'Acoustic Evidence Aid Report',label:'Legal review aid',purpose:'For organizing evidence before legal review. Not a certified measurement.'},
        neighbor:{title:'Neighbor Noise Evidence Report',label:'Neighbor noise',purpose:'For repeated neighbor noise, night disturbance, impact sounds, and mediation materials.',guidance:'Record time windows, duration, building/floor/room, manual event marks, and L10/L90 contrast.'},
        renovation:{title:'Renovation Construction Noise Report',label:'Renovation',purpose:'For renovation or construction noise and property follow-up.',guidance:'Capture start, peak, and quiet-after periods with location and peak events.'},
        elevator:{title:'Elevator Machine Room Low-Frequency Report',label:'Elevator room',purpose:'For elevator, shaft, pump, and low-frequency equipment noise review.',guidance:'Use C/Z weighting and one-third octave view; focus on 31.5-200 Hz.'},
        ktv:{title:'Retail or KTV Disturbance Report',label:'Retail/KTV',purpose:'For entertainment venue disturbance documentation.',guidance:'Record night segments, indoor point, window state, L5/L10 peaks, and continuous background.'},
        hvac:{title:'Outdoor AC Unit Noise Report',label:'Outdoor AC',purpose:'For HVAC outdoor unit, fan, compressor, and tonal noise documentation.',guidance:'Record startup, stable running, and shutdown; use spectrum to identify tonal noise.'},
        boundary:{title:'Factory Boundary Noise Report',label:'Factory boundary',purpose:'For preliminary factory boundary or workplace environmental noise documentation.',guidance:'Record point, boundary direction, time window, weather/window state, and the non-certified disclaimer.'},
      },
      reportFields:{details:'Session details',template:'Template',organization:'Organization',purpose:'Purpose',recorded:'Recorded',duration:'Duration',place:'Place',gps:'GPS',weighting:'Weighting',calibration:'Calibration',avg:'Avg',peak:'Peak',min:'Min',media:'Media',note:'Note',trend:'Trend',reference:'Reference',footer:'For field documentation only. Verify formal measurements with a certified sound level meter.'},
      summary:{subtitle:'ACOUSTIC FIELD REPORT',avgLine:'Average sound level · {level} · Field summary',peak:'Peak',min:'Min',duration:'Duration',trend:'Sound level trend',metadata:'Evidence metadata',calibration:'Calibration offset: {offset} dB · mic gain: {gain} dB',footer:'Note: For field documentation only. Verify formal measurements with a certified sound level meter.'},
      ui:{
        ready:'Ready',monitoring:'Monitoring',recording:'Recording',localMeter:'Field noise meter',permissionHint:'Tap Start monitoring to allow microphone access.',upgradeTitle:'Upgrade to Pro for ad-free evidence tools',upgradeDesc:'No ads, batch PDFs, evidence templates, calibration profiles, longer recordings, and cloud backup when available.',viewBenefits:'View plan',manageBenefits:'Manage plan',start:'Start monitoring',stop:'Stop monitoring',peak:'Peak',min:'Min',duration:'Duration',avg:'Average',quiet:'Quiet',moderate:'Moderate',loud:'Loud',wave:'Waveform',spectrum:'Spectrum',trend:'Trend',reference:'Sound reference',quickScene:'Quick scene tags',quickSceneHint:'Tap a tag to pre-fill notes and match the report template.',upgradePro:'Upgrade Pro',dataProcessedLocally:'Data processed locally',evidenceLibrary:'Evidence Library',recordStatus:'Recording status',notRecording:'Not recording',startVideo:'Start video',cameraPreview:'Camera preview',cameraOpen:'Open camera',cameraOpenSub:'For evidence photos and video',photoEvidence:'Evidence photo',video:'Video',preview:'Preview',photoMode:'Photo mode',videoMode:'Video mode',cameraHint:'Open the camera, then capture a dB-stamped evidence photo while monitoring.',openPhoto:'Open photo',gps:'GPS location',noLocation:'Not available',placeNotStarted:'Place not identified',savePlace:'Save place',rerunPlace:'Look up again',shareTitle:'Share SOUNDTEST.PRO with someone who needs noise evidence',shareDesc:'Share the app or a report summary. Exact coordinates stay private by default.',share:'Share',recordTools:'Record tools',recordToolsDesc:'Start recording, export records, or clear local evidence data. If there are no records, jump back to monitoring.',startRecord:'Start recording',exportCsv:'Export CSV',exportPdf:'Export PDF',clearRecords:'Clear records',noRecords:'No recordings yet',sessions:'Sessions',mean:'Mean',mapTools:'Map tools',mapToolsDesc:'Built from saved GPS records. Export an image or open the latest point in your map app.',refreshMap:'Refresh map',exportMap:'Export map image',openLatestLocation:'Open latest point',backMonitor:'Back to monitor',noiseMap:'Noise map',geoSessions:'Geotagged sessions',noGeoRecords:'No GPS-tagged records yet.',settings:'Measurement settings',languageLabel:'Language / 语言',languageDesc:'Use your system language, or choose any of the 9 website languages.',frequencyWeighting:'Frequency weighting',frequencyDesc:'A-weighting approximates human hearing and is commonly used in regulations.',timeWeighting:'Time weighting',timeDesc:'Fast catches peaks. Slow smooths steady noise.',fastShort:'Fast',slowShort:'Slow',advancedCalibration:'Advanced calibration',advancedDesc:'Phone mics, frequency response, and system processing vary widely. Adjust only when you have a reference meter; reports keep calibration details for context.',enterAdvanced:'Open advanced',alertThreshold:'Alert threshold',alertDesc:'Warn when sound exceeds this level.',enableAlert:'Enable alerts',placeLookup:'Place lookup',placeLookupDesc:'Identify nearby places after GPS is available. Coordinates may be sent to the selected map provider.',smoothing:'Waveform smoothing',about:'Notes',accuracy:'Accuracy',accuracyDesc:'For field documentation only. Verify formal measurements with a certified sound level meter.',version:'Version',privacy:'Privacy & compliance',feedback:'Feedback & bug report',subscription:'Plans & benefits',reportTemplate:'Report templates',templateType:'Template type',templateDesc:'Choose the PDF title, purpose, and tone for this use case.',organization:'Organization / project',organizationDesc:'Shown in PDF reports. Add a building, company, project, or client name.',storeAssets:'App Store copy',copyStore:'Copy listing',data:'Data',monitor:'Monitor',records:'Records',map:'Map'},
      placeholders:{note:'Add a note, such as near construction or late-night traffic',place:'Enter a place name',search:'Search notes or coordinates...',feedback:'Describe the issue, device/browser, steps to reproduce, or feature request.',organization:'Optional'},
      messages:{languageSaved:'Language preference saved.',copyStoreEmpty:'No store listing is available.',storeCopied:'Store listing copied.',clipboardUnsupported:'Clipboard access is unavailable. Select and copy the text manually.',summaryDownloaded:'Summary image downloaded.',pdfMissing:'PDF tools are still loading. Check your connection and try again.',noRecords:'No records yet.'},
      media:{audio:'Audio',video:'Video',none:'No media'},
      reference:[['0-49 dB','Quiet','Library, bedroom'],['50-69 dB','Moderate','Office, conversation'],['70-84 dB','Loud','Traffic, street'],['85+ dB','Hazardous','Risk of hearing damage']],
    },
  };

  function englishLocale(locale, languageSaved) {
    const base = I18N_DATA['en-US'];
    return {
      ...base,
      locale,
      messages: { ...base.messages, languageSaved },
    };
  }

  // Derived locales: all share en-US structure with only locale and languageSaved message changed
  I18N_DATA.es = englishLocale('es', 'Idioma guardado.');
  I18N_DATA.fr = englishLocale('fr', 'Langue enregistrée.');
  I18N_DATA.de = englishLocale('de', 'Sprache gespeichert.');
  I18N_DATA.ja = englishLocale('ja', '言語設定を保存しました。');
  I18N_DATA.ko = englishLocale('ko', '언어 설정이 저장되었습니다。');
  I18N_DATA.vi = englishLocale('vi', 'Đã lưu ngôn ngữ.');
  I18N_DATA.th = englishLocale('th', 'บันทึกภาษาแล้ว');

  window.__sfI18N = I18N_DATA;
  window.__sfSupportedAppLanguages = SUPPORTED_APP_LANGUAGES;

})();