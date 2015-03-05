var countriesWithAliases = [
  [1, 'Adrenal Haemorrhage'],
  [2, 'Cavernous Haemangioma (CNS)'],
  [3, 'Cerebral Arteriopathy with Subcortical Infarcts'],
  [4, 'Cerebral Embolism'],
  [5, 'Cerebral Infarction'], 
  [6, 'Cerebral Ischaemia'], 
  [7, 'Cerebral Occlusive Disease'], 
  [8, 'Cerebral Small Vessel Disease'], 
  [9, 'Cerebral Thrombosis'], 
  [10, 'Cerebral Vasculitis'], 
  [11, 'Cerebral Venous Thrombosis'], 
  [12, 'Cerebrovascular Accident (Thrombotic)'], 
  [13, 'Drop Attack'], 
  [14, 'Migrainous Stroke'], 
  [15, 'Multiple Cerebral Infarcts'], 
  [16, 'PICA Stroke'], 
  [17, 'Pontine Infarction'], 
  [18, 'Posterior Cerebral Circulatory Infarction'], 
  [19, 'Prolonged Reversible Ischaemic Neurological Deficiency'], 
  [20, 'Spinal Infarction'], 
  [21, 'Stroke (Thrombotic)'], 
  [22, 'Sturge-Weber Syndrome'], 
  [23, 'Suspected TIA'], 
  [24, 'Transient Global Amnesia'], 
  [25, 'Transient Ischaemic Attack'], 
];

//
//  var countriesWithAliases = [
//  [16, "Australia", ["Melbourne", "Tasmania"]],
//  [232, "United States", ["America", "UnitedStates", "USA", "U.S.A.", "US", "U.S.", "Hawaii", "Los Angeles"]],
//  [79, "United Kingdom", ["Great Britain", "UnitedKingdom", "U.K.", "UK", "England", "Wales", "Scotland", "Northern Ireland", "London"]],
//  [250, "New Zealand", ["NZ","NewZealand"]],
//  [49, "Cook Islands", ["Rarotonga"]],
//  [73, "Fiji"],
//  [40, "Canada"],
//  [115, "Japan"],
//  [157, "Malaysia"],
//  [104, "India"],
//  [242, "Samoa", ["Western Samoa"]],
//  [44, "China"],
//  [59, "Germany"],
//  [166, "The Netherlands", ["Holland", "Amsterdam"]],
//  [244, "South Africa"],
//  [239, "Vietnam"],
//  [194, "Singapore"],
//  [176, "Philippines"],
//  [75, "France", ["Paris"]],
//  [96, "Hong Kong", ["HK", "H.K.", "HongKong"]],
//  [240, "Vanuatu"],
//  [247, "Bali"],
//  [111, "Italy"],
//
//
//  [1, "Aruba"],
//  [2, "Afghanistan"],
//  [3, "Angola"],
//  [4, "Anguilla"],
//  [5, "Åland Islands"],
//  [6, "Albania"],
//  [7, "Andorra"],
//  [8, "Netherlands Antilles"],
//  [9, "United Arab Emirates", ["UAE", "Dubai"]],
//  [10, "Argentina"],
//  [11, "Armenia"],
//  [12, "American Samoa"],
//  [13, "Antarctica"],
//  [14, "French Southern Territories"],
//  [15, "Antigua and Barbuda"],
//  [17, "Austria"],
//  [18, "Azerbaijan"],
//  [19, "Burundi"],
//  [20, "Belgium"],
//  [21, "Benin"],
//  [22, "Burkina Faso"],
//  [23, "Bangladesh"],
//  [24, "Bulgaria"],
//  [25, "Bahrain"],
//  [26, "The Bahamas"],
//  [27, "Bosnia and Herzegovina"],
//  [28, "Saint Barthelemy"],
//  [29, "Belarus"],
//  [30, "Belize"],
//  [31, "Bermuda"],
//  [32, "Bolivia"],
//  [33, "Brazil"],
//  [34, "Barbados"],
//  [35, "Brunei Darussalam"],
//  [36, "Bhutan"],
//  [37, "Bouvet Island"],
//  [38, "Botswana"],
//  [39, "Central African Republic"],
//  [41, "Cocos (Keeling) Islands"],
//  [42, "Switzerland"],
//  [43, "Chile"],
//  [45, "Cote d\u0027Ivoire", ["Ivory Coast"]],
//  [46, "Cameroon"],
//  [47, "Democratic Republic of the Congo"],
//  [48, "Congo"],
//  [50, "Colombia"],
//  [51, "Comoros"],
//  [52, "Cape Verde"],
//  [53, "Costa Rica"],
//  [54, "Cuba"],
//  [55, "Christmas Island"],
//  [56, "Cayman Islands"],
//  [57, "Cyprus"],
//  [58, "Czech Republic"],
//  [60, "Djibouti"],
//  [61, "Dominica"],
//  [62, "Denmark"],
//  [63, "Dominican Republic"],
//  [64, "Algeria"],
//  [65, "Ecuador"],
//  [66, "Egypt"],
//  [67, "Eritrea"],
//  [68, "Western Sahara"],
//  [69, "Spain"],
//  [70, "Estonia"],
//  [71, "Ethiopia"],
//  [72, "Finland"],
//  [74, "Falkland Islands", ["Malvinas"]],
//  [76, "Faroe Islands"],
//  [77, "Micronesia"],
//  [78, "Gabon"],
//  [80, "Georgia"],
//  [81, "Guernsey"],
//  [82, "Ghana"],
//  [83, "Gibraltar"],
//  [84, "Guinea"],
//  [85, "Guadeloupe"],
//  [86, "Gambia"],
//  [87, "Guinea-Bissau"],
//  [88, "Equatorial Guinea"],
//  [89, "Greece"],
//  [90, "Grenada"],
//  [91, "Greenland"],
//  [92, "Guatemala"],
//  [93, "French Guiana"],
//  [94, "Guam"],
//  [95, "Guyana"],
//  [97, "Heard Island and McDonald Islands"],
//  [98, "Honduras"],
//  [99, "Croatia"],
//  [100, "Haiti"],
//  [101, "Hungary"],
//  [102, "Indonesia"],
//  [103, "Isle of Man"],
//  [105, "British Indian Ocean Territory"],
//  [106, "Ireland"],
//  [107, "Iran"],
//  [108, "Iraq"],
//  [109, "Iceland"],
//  [110, "Israel"],
//  [112, "Jamaica"],
//  [113, "Jersey"],
//  [114, "Jordan"],
//  [116, "Kazakhstan"],
//  [117, "Kenya"],
//  [118, "Kyrgyzstan"],
//  [119, "Cambodia"],
//  [120, "Kiribati"],
//  [121, "Saint Kitts and Nevis", ["St Kitts and Nevis"]],
//  [122, "South Korea"],
//  [123, "Kuwait"],
//  [124, "Laos"],
//  [125, "Lebanon"],
//  [126, "Liberia"],
//  [127, "Libya"],
//  [128, "Saint Lucia"],
//  [129, "Liechtenstein"],
//  [130, "Sri Lanka", ["SriLanka"]],
//  [131, "Lesotho"],
//  [132, "Lithuania"],
//  [133, "Luxembourg"],
//  [134, "Latvia"],
//  [135, "Macao"],
//  [136, "Saint Martin (French part)"],
//  [137, "Morocco"],
//  [138, "Monaco"],
//  [139, "Moldova"],
//  [140, "Madagascar"],
//  [141, "Maldives"],
//  [142, "Mexico"],
//  [143, "Marshall Islands"],
//  [144, "Macedonia"],
//  [145, "Mali"],
//  [146, "Malta"],
//  [147, "Myanmar", ["Burma"]],
//  [148, "Montenegro"],
//  [149, "Mongolia"],
//  [150, "Northern Mariana Islands"],
//  [151, "Mozambique"],
//  [152, "Mauritania"],
//  [153, "Montserrat"],
//  [154, "Martinique"],
//  [155, "Mauritius"],
//  [156, "Malawi"],
//  [158, "Mayotte"],
//  [159, "Namibia"],
//  [160, "New Caledonia", ["Noumea"]],
//  [161, "Niger"],
//  [162, "Norfolk Island"],
//  [163, "Nigeria"],
//  [164, "Nicaragua"],
//  [165, "Niue"],
//  [167, "Norway"],
//  [168, "Nepal"],
//  [169, "Nauru"],
//  [171, "Oman"],
//  [172, "Pakistan"],
//  [173, "Panama"],
//  [174, "Pitcairn"],
//  [175, "Peru"],
//  [177, "Palau"],
//  [178, "Papua New Guinea", ["PNG", "P.N.G."]],
//  [179, "Poland"],
//  [180, "Puerto Rico"],
//  [181, "North Korea"],
//  [182, "Portugal"],
//  [183, "Paraguay"],
//  [184, "Palestinian Territory, Occupied"],
//  [185, "French Polynesia"],
//  [186, "Qatar"],
//  [187, "Reunion"],
//  [188, "Romania"],
//  [189, "Russia"],
//  [190, "Rwanda"],
//  [191, "Saudi Arabia"],
//  [192, "Sudan"],
//  [193, "Senegal"],
//  [195, "South Georgia and the South Sandwich Islands"],
//  [196, "Saint Helena, Ascension and Tristan da Cunha"],
//  [197, "Svalbard and Jan Mayen"],
//  [198, "Solomon Islands"],
//  [199, "Sierra Leone"],
//  [200, "El Salvador"],
//  [201, "San Marino"],
//  [202, "Somalia"],
//  [203, "Saint Pierre and Miquelon"],
//  [204, "Serbia"],
//  [205, "Sao Tome and Principe"],
//  [206, "Suriname"],
//  [207, "Slovakia"],
//  [208, "Slovenia"],
//  [209, "Sweden"],
//  [210, "Swaziland"],
//  [211, "Seychelles"],
//  [212, "Syria"],
//  [213, "Turks and Caicos Islands"],
//  [214, "Chad"],
//  [215, "Togo"],
//  [216, "Thailand", ["Bangkok", "Phuket"]],
//  [217, "Tajikistan"],
//  [218, "Tokelau"],
//  [219, "Turkmenistan"],
//  [220, "East Timor", ["Timor-Leste"]],
//  [221, "Tonga"],
//  [222, "Trinidad and Tobago"],
//  [223, "Tunisia"],
//  [224, "Turkey"],
//  [225, "Tuvalu"],
//  [226, "Taiwan"],
//  [227, "Tanzania"],
//  [228, "Uganda"],
//  [229, "Ukraine"],
//  [230, "United States Minor Outlying Islands"],
//  [231, "Uruguay"],
//  [233, "Uzbekistan"],
//  [234, "Holy See (Vatican City State)"],
//  [235, "Saint Vincent and the Grenadines"],
//  [236, "Venezuela"],
//  [237, "British Virgin Islands"],
//  [238, "US Virgin Islands"],
//  [241, "Wallis and Futuna"],
//  [243, "Yemen"],
//  [245, "Zambia"],
//  [246, "Zimbabwe"],
//  [248, "Tahiti"],
//  [249, "Worldwide"]
//  ];