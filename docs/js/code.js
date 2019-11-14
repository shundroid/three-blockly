/**
 * Blockly Demos: Code
 *
 * Copyright 2012 Google Inc.
 * https://developers.google.com/blockly/
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview JavaScript for Blockly's Code demo.
 * @author fraser@google.com (Neil Fraser)
 */
'use strict';

/**
 * Create a namespace for the application.
 */
var Code = {};

/**
 * Blockly's main workspace.
 * @type {Blockly.WorkspaceSvg}
 */
Code.workspace = null;

/**
 * Lookup for names of supported languages.  Keys should be in ISO 639 format.
 */
Code.LANGUAGE_NAME = {
  'ar': 'العربية',
  'be-tarask': 'Taraškievica',
  'br': 'Brezhoneg',
  'ca': 'Català',
  'cs': 'Česky',
  'da': 'Dansk',
  'de': 'Deutsch',
  'el': 'Ελληνικά',
  'en': 'English',
  'es': 'Español',
  'et': 'Eesti',
  'fa': 'فارسی',
  'fr': 'Français',
  'he': 'עברית',
  'hrx': 'Hunsrik',
  'hu': 'Magyar',
  'ia': 'Interlingua',
  'is': 'Íslenska',
  'it': 'Italiano',
  'ja': '日本語',
  'ko': '한국어',
  'mk': 'Македонски',
  'ms': 'Bahasa Melayu',
  'nb': 'Norsk Bokmål',
  'nl': 'Nederlands, Vlaams',
  'oc': 'Lenga d\'òc',
  'pl': 'Polski',
  'pms': 'Piemontèis',
  'pt-br': 'Português Brasileiro',
  'ro': 'Română',
  'ru': 'Русский',
  'sc': 'Sardu',
  'sk': 'Slovenčina',
  'sr': 'Српски',
  'sv': 'Svenska',
  'ta': 'தமிழ்',
  'th': 'ภาษาไทย',
  'tlh': 'tlhIngan Hol',
  'tr': 'Türkçe',
  'uk': 'Українська',
  'vi': 'Tiếng Việt',
  'zh-hans': '简体中文',
  'zh-hant': '正體中文'
};

/**
 * Is the current language (Code.LANG) an RTL language?
 * @return {boolean} True if RTL, false if LTR.
 */
Code.isRtl = function() {
  var LANGUAGE_RTL = ['ar', 'fa', 'he', 'lki'];
  return LANGUAGE_RTL.indexOf(Code.LANG) != -1;
};

/**
 * User's language (e.g. "en").
 * @type {string}
 */
Code.LANG = (function() {
  // Extracts a parameter from the URL.
  function getStringParamFromUrl(name, defaultValue) {
    var val = location.search.match(new RegExp('[?&]' + name + '=([^&]+)'));
    return val ? decodeURIComponent(val[1].replace(/\+/g, '%20')) : defaultValue;
  }
  var lang = getStringParamFromUrl('lang', '');
  if (Code.LANGUAGE_NAME[lang] === undefined) {
    // Default to English.
    lang = 'ja';
  }
  return lang;
}());

/**
 * Initialize the page language.
 */
Code.initLanguage = function(langMenu) {
  // Set the HTML's language and direction.
  var rtl = Code.isRtl();
  document.dir = rtl ? 'rtl' : 'ltr';
  document.head.parentElement.setAttribute('lang', Code.LANG);

  // Sort languages alphabetically.
  var languages = [];
  for (var lang in Code.LANGUAGE_NAME) {
    languages.push([Code.LANGUAGE_NAME[lang], lang]);
  }
  var comp = function(a, b) {
    // Sort based on first argument ('English', 'Русский', '简体字', etc).
    if (a[0] > b[0]) return 1;
    if (a[0] < b[0]) return -1;
    return 0;
  };

  languages.sort(comp);
  // Populate the language selection menu.
  var languageMenu = document.getElementById(langMenu);
  languageMenu.options.length = 0;
  for (var i = 0; i < languages.length; i++) {
    var tuple = languages[i];
    var lang = tuple[tuple.length - 1];
    var option = new Option(tuple[0], lang);
    if (lang == Code.LANG) {
      option.selected = true;
    }
    languageMenu.options.add(option);
  }
  //Save the blocks and reload with a different language.
  function changeLanguage() {
    // Store the blocks for the duration of the reload.
    // This should be skipped for the index page, which has no blocks and does
    // not load Blockly.
    // MSIE 11 does not support sessionStorage on file:// URLs.
    if (typeof Blockly != 'undefined' && window.sessionStorage) {
      var xml = Blockly.Xml.workspaceToDom(Code.workspace);
      var text = Blockly.Xml.domToText(xml);
      window.sessionStorage.loadOnceBlocks = text;
    }
  
    var languageMenu = document.getElementById('languageMenu');
    var newLang = encodeURIComponent(
        languageMenu.options[languageMenu.selectedIndex].value);
    var search = window.location.search;
    if (search.length <= 1) {
      search = '?lang=' + newLang;
    } else if (search.match(/[?&]lang=[^&]*/)) {
      search = search.replace(/([?&]lang=)[^&]*/, '$1' + newLang);
    } else {
      search = search.replace(/\?/, '?lang=' + newLang + '&');
    }
  
    window.location = window.location.protocol + '//' +
        window.location.host + window.location.pathname + search;
  }  
  languageMenu.addEventListener('change', changeLanguage, true);
}

// Load the Code demo's language strings.
document.write('<script src="./blockly/msg2/' + Code.LANG + '.js"></script>\n');
// Load Blockly's language strings.
document.write('<script src="./blockly/msg/js/' + Code.LANG + '.js"></script>\n');

/**
 * Bind a function to a button's click event.
 * On touch enabled browsers, ontouchend is treated as equivalent to onclick.
 * @param {!Element|string} el Button element or ID thereof.
 * @param {!Function} func Event handler to bind.
 */
Code.bindClick = function(el, func) {
  console.log(el)
  if (typeof el == 'string') {
    el = document.getElementById(el);
  }
  if (el) {
    el.addEventListener('click', func, true);
    el.addEventListener('touchend', func, true);
  } else {
    console.log("error el !")
  }
};

/**
 * List of tab names.
 * @private
 */
Code.TABS_ = ['blocks', 'javascript', 'xml'];
Code.selected = 'blocks';

/**
 * Populate the currently selected pane with content generated from the blocks.
 */
Code.renderContent = function() {
  function removeId(txt){
    //return txt;
    return txt.replace(/id=".*?"/g, "");
  }
  var content = document.getElementById('content_' + Code.selected);
  console.log("renderContent");
  // Initialize the pane.
  if (content.id == 'content_xml') {
    var xmlTextarea = document.getElementById('content_xml');
    var xmlDom = Blockly.Xml.workspaceToDom(Code.workspace);
    var xmlText = Blockly.Xml.domToPrettyText(xmlDom);
    //console.log(xmlText);
    xmlText = removeId(xmlText);
    //console.log(xmlText);
    xmlTextarea.value = xmlText;
    xmlTextarea.focus();
  } else if (content.id == 'content_javascript') {
    var code = Blockly.JavaScript.workspaceToCode(Code.workspace);
    code = codeReplace(code);
    content.textContent = code;

    if (false && (typeof PR.prettyPrintOne == 'function')) {
      code = content.textContent;
      code = PR.prettyPrintOne(code, 'js');
      content.innerHTML = code;
    }
  }
};

/**
 * Initialize Blockly.  Called on page load.
 */
Code.initBlockly = function(toolboxText) {

  // The toolbox XML specifies each category name using Blockly's messaging
  // format (eg. `<category name="%{BKY_CATLOGIC}">`).
  // These message keys need to be defined in `Blockly.Msg` in order to
  // be decoded by the library. Therefore, we'll use the `MSG` dictionary that's
  // been defined for each language to import each category name message
  // into `Blockly.Msg`.
  // TODO: Clean up the message files so this is done explicitly instead of
  // through this for-loop.
  for (var messageKey in MSG) {
    if (messageKey.indexOf('cat') == 0) {
      Blockly.Msg[messageKey.toUpperCase()] = MSG[messageKey];
    }
  }

  /**
 * @fileoverview Classic theme.
 * Contains multi-coloured border to create shadow effect.
 */
var defaultBlockStyles = {
  "colour_blocks": {
    "colourPrimary": Blockly.Msg["COLOUR_HUE"]
  },
  "list_blocks": {
    "colourPrimary": Blockly.Msg["LISTS_HUE"]
  },
  "logic_blocks": {
    "colourPrimary": Blockly.Msg["LOGIC_HUE"]
  },
  "loop_blocks": {
    //"colourPrimary": "#FF26B7"  //320".85-1
    "colourPrimary": Blockly.Msg["LOOPS_HUE"]
  },
  "math_blocks": {
    "colourPrimary": Blockly.Msg["MATH_HUE"]
  },
  "procedure_blocks": {
    "colourPrimary": Blockly.Msg["PROCEDURES_HUE"]
  },
  "text_blocks": {
    "colourPrimary": Blockly.Msg["TEXTS_HUE"]
  },
  "variable_blocks": {
    "colourPrimary": Blockly.Msg["VARIABLES_HUE"]
  },
  "variable_dynamic_blocks": {
    "colourPrimary": Blockly.Msg["VARIABLES_DYNAMIC_HUE"]
  },
  "hat_blocks": {
    "colourPrimary": "330",
    "hat": "cap"
  }
};

var categoryStyles = {
  "colour_category": {
    "colour": "20"
  },
  "list_category": {
    "colour": "260"
  },
  "logic_category": {
    "colour": Blockly.Msg["LOGIC_CATEGORY_HUE"]
  },
  "loop_category": {
    "colour": Blockly.Msg["LOOPS_CATEGORY_HUE"]
  },
  "math_category": {
    "colour": "230"
  },
  "procedure_category": {
    "colour": "290"
  },
  "text_category": {
    "colour": "160"
  },
  "variable_category": {
    "colour": "330"
  },
  "variable_dynamic_category": {
    "colour": "310"
  }
};

  var toolboxXml = Blockly.Xml.textToDom(toolboxText);
  Code.workspace = Blockly.inject('content_blocks',
    {
      grid: {
        spacing: 25,
        length: 3,
        colour: '#ccc',
        snap: true
      },
      media: './media/',
      rtl: Code.isRtl(),
      toolbox: toolboxXml,
      zoom: {
        controls: true,
        wheel: true
      },
      theme: new Blockly.Theme(defaultBlockStyles, categoryStyles),
    }
  );

  // カスタムツールボックス
  Code.workspace.registerToolboxCategoryCallback('JCODE_THREE', JCODE.three.toolbox);
  Code.workspace.registerToolboxCategoryCallback('JCODE_INSTRUCTION', JCODE.jcodeInstractionCallback);
  
  // Add to reserved word list: Local variables in execution environment (runJS)
  // and the infinite loop detection function.
  Blockly.JavaScript.addReservedWords('code,timeouts,checkTimeout');

  // Switch the visible pane when a tab is clicked.
  function tabClick(clickedName) {
    // If the XML tab was open, save and render the content.
    if (document.getElementById('tab_xml').className == 'tabon') {
      var xmlTextarea = document.getElementById('content_xml');
      var xmlText = xmlTextarea.value;
      var xmlDom = null;
      try {
        xmlDom = Blockly.Xml.textToDom(xmlText);
      } catch (e) {
        var q =
            window.confirm(MSG['badXml'].replace('%1', e));
        if (!q) {
          // Leave the user on the XML tab.
          return;
        }
      }
      if (xmlDom) {
        Code.workspace.clear();
        Blockly.Xml.domToWorkspace(xmlDom, Code.workspace);
      }
    }

    if (document.getElementById('tab_blocks').className == 'tabon') {
      Code.workspace.setVisible(false);
    }
    // Deselect all tabs and hide all panes.
    for (var i = 0; i < Code.TABS_.length; i++) {
      var name = Code.TABS_[i];
      document.getElementById('tab_' + name).className = 'taboff';
      document.getElementById('content_' + name).style.visibility = 'hidden';
    }

    // Select the active tab.
    Code.selected = clickedName;
    document.getElementById('tab_' + clickedName).className = 'tabon';
    // Show the selected pane.
    document.getElementById('content_' + clickedName).style.visibility = 'visible';
    Code.renderContent();
    if (clickedName == 'blocks') {
      Code.workspace.setVisible(true);
    }
    Blockly.svgResize(Code.workspace);
  }
  tabClick(Code.selected);

  for (var i = 0; i < Code.TABS_.length; i++) {
    var name = Code.TABS_[i];
    Code.bindClick('tab_' + name,
      function(name_) {return function() {tabClick(name_);};}(name));
  }

  function onresize(e) {
    Blockly.svgResize(Code.workspace);
  }
  window.addEventListener('resize', onresize, false);
  onresize();

  // Lazy-load the syntax-highlighting.
  // Load the Prettify CSS and JavaScript.
  function importPrettify() {
    var script = document.createElement('script');
    script.setAttribute('src', 'https://cdn.rawgit.com/google/code-prettify/master/loader/run_prettify.js');
    document.head.appendChild(script);
  }
  window.setTimeout(Code.importPrettify, 1);
}


/**
 * Execute the user's code.
 * Just a quick and dirty eval.  Catch infinite loops.
 */
function codeReplace(code) {
  var code = code.replace(/function/g,"async function");
  code = code.replace(/async function mathRandomInt/,"function mathRandomInt");
  return code.replace(/async function colourRandom/,"function colourRandom");
}
Code.runJS = function() {
  console.log("Code.runJS");
  Blockly.JavaScript.INFINITE_LOOP_TRAP = '  checkTimeout();\n';
  var timeouts = 0;
  var checkTimeout = function() {
    if (timeouts++ > 1000000) {
      throw MSG['timeout'];
    }
  };
  var code = Blockly.JavaScript.workspaceToCode(Code.workspace);
  code = codeReplace(code);
  Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
  try {
    eval("(async () => {" + code + "})()")
    //eval(code);
  } catch (e) {
    alert(MSG['badCode'].replace('%1', e));
  }
};

/**
 * Discard all blocks from the workspace.
 */
Code.discard = function() {
  var count = Code.workspace.getAllBlocks().length;
  if (count < 2 ||
      window.confirm(Blockly.Msg.DELETE_ALL_BLOCKS.replace('%1', count))) {
    Code.workspace.clear();
    if (window.location.hash) {
      window.location.hash = '';
    }
  }
};

/**
 * Load blocks saved on App Engine Storage or in session/local storage.
 * @param {string} defaultXml Text representation of default blocks.
 */
/*
Code.loadBlocks = function(defaultXml) {
  try {
    var loadOnce = window.sessionStorage.loadOnceBlocks;
  } catch(e) {
    // Firefox sometimes throws a SecurityError when accessing sessionStorage.
    // Restarting Firefox fixes this, so it looks like a bug.
    var loadOnce = null;
  }
  if ('BlocklyStorage' in window && window.location.hash.length > 1) {
    // An href with #key trigers an AJAX call to retrieve saved blocks.
    BlocklyStorage.retrieveXml(window.location.hash.substring(1));
  } else if (loadOnce) {
    // Language switching stores the blocks during the reload.
    delete window.sessionStorage.loadOnceBlocks;
    var xml = Blockly.Xml.textToDom(loadOnce);
    Blockly.Xml.domToWorkspace(xml, Code.workspace);
  } else if (defaultXml) {
    // Load the editor with default starting blocks.
    var xml = Blockly.Xml.textToDom(defaultXml);
    Blockly.Xml.domToWorkspace(xml, Code.workspace);
  } else if ('BlocklyStorage' in window) {
    // Restore saved blocks in a separate thread so that subsequent
    // initialization is not affected from a failed load.
    window.setTimeout(BlocklyStorage.restoreBlocks, 0);
  }
}
*/

// 初期化
$(function(){
	console.log("All resources finished loading!");
  // Init html buttons
  Code.bindClick('trashButton', function() {Code.discard(); Code.renderContent();});
  //function() {JCODE.removeAllFromPlayground()});
  Code.bindClick('runButton', Code.runJS);
    
  // Inject language strings.
  document.title += ' ' + MSG['title'];
  document.getElementById('title').textContent = MSG['title'];
  document.getElementById('tab_blocks').textContent = MSG['blocks'];

  document.getElementById('linkButton').title = MSG['linkTooltip'];
  document.getElementById('runButton').title = MSG['runTooltip'];
  document.getElementById('trashButton').title = MSG['trashTooltip'];

  // Three.js 初期化
//  var domElement = document.getElementById("threejs-canvas");
//  JCODE.initThreejs(domElement);  // init threejs area

/*
  function clearStudentsGroup(){
    JCODE.clearGroup ("playground",{shape:"sphere", color:'#ff0000', speed:1.2, arrow:"during"});
  }
	$("#clearButton").click(clearStudentsGroup);
*/
  
  // Blockly の初期化
  Code.initLanguage('languageMenu');
	Code.initBlockly($('#toolbox_all').prop('outerHTML'));  // Blockly の初期化

  // インストラクションエリアを初期化する
  //$("#instruction-canvas").html("<div id='instructions' style='width:100%;height:300px;overflow-y:scroll;'></div>");
  $("#instruction-canvas").html("<div id='instructions' style='width:100%;height:250px;overflow-y:scroll;'></div>");
  
  // project 初期化
  JCODE.projectInit();
    
});

