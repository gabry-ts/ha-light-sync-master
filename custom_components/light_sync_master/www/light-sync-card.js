function t(t,e,s,i){var o,r=arguments.length,n=r<3?e:null===i?i=Object.getOwnPropertyDescriptor(e,s):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(t,e,s,i);else for(var a=t.length-1;a>=0;a--)(o=t[a])&&(n=(r<3?o(n):r>3?o(e,s,n):o(e,s))||n);return r>3&&n&&Object.defineProperty(e,s,n),n}"function"==typeof SuppressedError&&SuppressedError;const e=globalThis,s=e.ShadowRoot&&(void 0===e.ShadyCSS||e.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,i=Symbol(),o=new WeakMap;let r=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==i)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(s&&void 0===t){const s=void 0!==e&&1===e.length;s&&(t=o.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&o.set(e,t))}return t}toString(){return this.cssText}};const n=s?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return(t=>new r("string"==typeof t?t:t+"",void 0,i))(e)})(t):t,{is:a,defineProperty:l,getOwnPropertyDescriptor:c,getOwnPropertyNames:h,getOwnPropertySymbols:d,getPrototypeOf:p}=Object,u=globalThis,g=u.trustedTypes,v=g?g.emptyScript:"",y=u.reactiveElementPolyfillSupport,f=(t,e)=>t,m={toAttribute(t,e){switch(e){case Boolean:t=t?v:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let s=t;switch(e){case Boolean:s=null!==t;break;case Number:s=null===t?null:Number(t);break;case Object:case Array:try{s=JSON.parse(t)}catch(t){s=null}}return s}},_=(t,e)=>!a(t,e),$={attribute:!0,type:String,converter:m,reflect:!1,useDefault:!1,hasChanged:_};Symbol.metadata??=Symbol("metadata"),u.litPropertyMetadata??=new WeakMap;let b=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=$){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const s=Symbol(),i=this.getPropertyDescriptor(t,s,e);void 0!==i&&l(this.prototype,t,i)}}static getPropertyDescriptor(t,e,s){const{get:i,set:o}=c(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:i,set(e){const r=i?.call(this);o?.call(this,e),this.requestUpdate(t,r,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??$}static _$Ei(){if(this.hasOwnProperty(f("elementProperties")))return;const t=p(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(f("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(f("properties"))){const t=this.properties,e=[...h(t),...d(t)];for(const s of e)this.createProperty(s,t[s])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,s]of e)this.elementProperties.set(t,s)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const s=this._$Eu(t,e);void 0!==s&&this._$Eh.set(s,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const t of s)e.unshift(n(t))}else void 0!==t&&e.push(n(t));return e}static _$Eu(t,e){const s=e.attribute;return!1===s?void 0:"string"==typeof s?s:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((t,i)=>{if(s)t.adoptedStyleSheets=i.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const s of i){const i=document.createElement("style"),o=e.litNonce;void 0!==o&&i.setAttribute("nonce",o),i.textContent=s.cssText,t.appendChild(i)}})(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$ET(t,e){const s=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,s);if(void 0!==i&&!0===s.reflect){const o=(void 0!==s.converter?.toAttribute?s.converter:m).toAttribute(e,s.type);this._$Em=t,null==o?this.removeAttribute(i):this.setAttribute(i,o),this._$Em=null}}_$AK(t,e){const s=this.constructor,i=s._$Eh.get(t);if(void 0!==i&&this._$Em!==i){const t=s.getPropertyOptions(i),o="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:m;this._$Em=i;const r=o.fromAttribute(e,t.type);this[i]=r??this._$Ej?.get(i)??r,this._$Em=null}}requestUpdate(t,e,s){if(void 0!==t){const i=this.constructor,o=this[t];if(s??=i.getPropertyOptions(t),!((s.hasChanged??_)(o,e)||s.useDefault&&s.reflect&&o===this._$Ej?.get(t)&&!this.hasAttribute(i._$Eu(t,s))))return;this.C(t,e,s)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:s,reflect:i,wrapped:o},r){s&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,r??e??this[t]),!0!==o||void 0!==r)||(this._$AL.has(t)||(this.hasUpdated||s||(e=void 0),this._$AL.set(t,e)),!0===i&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,s]of t){const{wrapped:t}=s,i=this[e];!0!==t||this._$AL.has(e)||void 0===i||this.C(e,void 0,s,i)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};b.elementStyles=[],b.shadowRootOptions={mode:"open"},b[f("elementProperties")]=new Map,b[f("finalized")]=new Map,y?.({ReactiveElement:b}),(u.reactiveElementVersions??=[]).push("2.1.1");const x=globalThis,A=x.trustedTypes,w=A?A.createPolicy("lit-html",{createHTML:t=>t}):void 0,S="$lit$",E=`lit$${Math.random().toFixed(9).slice(2)}$`,C="?"+E,P=`<${C}>`,k=document,M=()=>k.createComment(""),O=t=>null===t||"object"!=typeof t&&"function"!=typeof t,U=Array.isArray,z="[ \t\n\f\r]",N=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,H=/-->/g,R=/>/g,T=RegExp(`>|${z}(?:([^\\s"'>=/]+)(${z}*=${z}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),L=/'/g,j=/"/g,D=/^(?:script|style|textarea|title)$/i,B=(t=>(e,...s)=>({_$litType$:t,strings:e,values:s}))(1),I=Symbol.for("lit-noChange"),W=Symbol.for("lit-nothing"),q=new WeakMap,V=k.createTreeWalker(k,129);function J(t,e){if(!U(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==w?w.createHTML(e):e}const F=(t,e)=>{const s=t.length-1,i=[];let o,r=2===e?"<svg>":3===e?"<math>":"",n=N;for(let e=0;e<s;e++){const s=t[e];let a,l,c=-1,h=0;for(;h<s.length&&(n.lastIndex=h,l=n.exec(s),null!==l);)h=n.lastIndex,n===N?"!--"===l[1]?n=H:void 0!==l[1]?n=R:void 0!==l[2]?(D.test(l[2])&&(o=RegExp("</"+l[2],"g")),n=T):void 0!==l[3]&&(n=T):n===T?">"===l[0]?(n=o??N,c=-1):void 0===l[1]?c=-2:(c=n.lastIndex-l[2].length,a=l[1],n=void 0===l[3]?T:'"'===l[3]?j:L):n===j||n===L?n=T:n===H||n===R?n=N:(n=T,o=void 0);const d=n===T&&t[e+1].startsWith("/>")?" ":"";r+=n===N?s+P:c>=0?(i.push(a),s.slice(0,c)+S+s.slice(c)+E+d):s+E+(-2===c?e:d)}return[J(t,r+(t[s]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),i]};class K{constructor({strings:t,_$litType$:e},s){let i;this.parts=[];let o=0,r=0;const n=t.length-1,a=this.parts,[l,c]=F(t,e);if(this.el=K.createElement(l,s),V.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(i=V.nextNode())&&a.length<n;){if(1===i.nodeType){if(i.hasAttributes())for(const t of i.getAttributeNames())if(t.endsWith(S)){const e=c[r++],s=i.getAttribute(t).split(E),n=/([.?@])?(.*)/.exec(e);a.push({type:1,index:o,name:n[2],strings:s,ctor:"."===n[1]?X:"?"===n[1]?tt:"@"===n[1]?et:Q}),i.removeAttribute(t)}else t.startsWith(E)&&(a.push({type:6,index:o}),i.removeAttribute(t));if(D.test(i.tagName)){const t=i.textContent.split(E),e=t.length-1;if(e>0){i.textContent=A?A.emptyScript:"";for(let s=0;s<e;s++)i.append(t[s],M()),V.nextNode(),a.push({type:2,index:++o});i.append(t[e],M())}}}else if(8===i.nodeType)if(i.data===C)a.push({type:2,index:o});else{let t=-1;for(;-1!==(t=i.data.indexOf(E,t+1));)a.push({type:7,index:o}),t+=E.length-1}o++}}static createElement(t,e){const s=k.createElement("template");return s.innerHTML=t,s}}function Z(t,e,s=t,i){if(e===I)return e;let o=void 0!==i?s._$Co?.[i]:s._$Cl;const r=O(e)?void 0:e._$litDirective$;return o?.constructor!==r&&(o?._$AO?.(!1),void 0===r?o=void 0:(o=new r(t),o._$AT(t,s,i)),void 0!==i?(s._$Co??=[])[i]=o:s._$Cl=o),void 0!==o&&(e=Z(t,o._$AS(t,e.values),o,i)),e}class G{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:s}=this._$AD,i=(t?.creationScope??k).importNode(e,!0);V.currentNode=i;let o=V.nextNode(),r=0,n=0,a=s[0];for(;void 0!==a;){if(r===a.index){let e;2===a.type?e=new Y(o,o.nextSibling,this,t):1===a.type?e=new a.ctor(o,a.name,a.strings,this,t):6===a.type&&(e=new st(o,this,t)),this._$AV.push(e),a=s[++n]}r!==a?.index&&(o=V.nextNode(),r++)}return V.currentNode=k,i}p(t){let e=0;for(const s of this._$AV)void 0!==s&&(void 0!==s.strings?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}}class Y{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,s,i){this.type=2,this._$AH=W,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=Z(this,t,e),O(t)?t===W||null==t||""===t?(this._$AH!==W&&this._$AR(),this._$AH=W):t!==this._$AH&&t!==I&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>U(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==W&&O(this._$AH)?this._$AA.nextSibling.data=t:this.T(k.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:s}=t,i="number"==typeof s?this._$AC(t):(void 0===s.el&&(s.el=K.createElement(J(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===i)this._$AH.p(e);else{const t=new G(i,this),s=t.u(this.options);t.p(e),this.T(s),this._$AH=t}}_$AC(t){let e=q.get(t.strings);return void 0===e&&q.set(t.strings,e=new K(t)),e}k(t){U(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,i=0;for(const o of t)i===e.length?e.push(s=new Y(this.O(M()),this.O(M()),this,this.options)):s=e[i],s._$AI(o),i++;i<e.length&&(this._$AR(s&&s._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=t.nextSibling;t.remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class Q{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,i,o){this.type=1,this._$AH=W,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=o,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=W}_$AI(t,e=this,s,i){const o=this.strings;let r=!1;if(void 0===o)t=Z(this,t,e,0),r=!O(t)||t!==this._$AH&&t!==I,r&&(this._$AH=t);else{const i=t;let n,a;for(t=o[0],n=0;n<o.length-1;n++)a=Z(this,i[s+n],e,n),a===I&&(a=this._$AH[n]),r||=!O(a)||a!==this._$AH[n],a===W?t=W:t!==W&&(t+=(a??"")+o[n+1]),this._$AH[n]=a}r&&!i&&this.j(t)}j(t){t===W?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class X extends Q{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===W?void 0:t}}class tt extends Q{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==W)}}class et extends Q{constructor(t,e,s,i,o){super(t,e,s,i,o),this.type=5}_$AI(t,e=this){if((t=Z(this,t,e,0)??W)===I)return;const s=this._$AH,i=t===W&&s!==W||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,o=t!==W&&(s===W||i);i&&this.element.removeEventListener(this.name,this,s),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class st{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){Z(this,t)}}const it=x.litHtmlPolyfillSupport;it?.(K,Y),(x.litHtmlVersions??=[]).push("3.3.1");const ot=globalThis;class rt extends b{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,s)=>{const i=s?.renderBefore??e;let o=i._$litPart$;if(void 0===o){const t=s?.renderBefore??null;i._$litPart$=o=new Y(e.insertBefore(M(),t),t,void 0,s??{})}return o._$AI(t),o})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return I}}rt._$litElement$=!0,rt.finalized=!0,ot.litElementHydrateSupport?.({LitElement:rt});const nt=ot.litElementPolyfillSupport;nt?.({LitElement:rt}),(ot.litElementVersions??=[]).push("4.2.1");const at={attribute:!0,type:String,converter:m,reflect:!1,hasChanged:_},lt=(t=at,e,s)=>{const{kind:i,metadata:o}=s;let r=globalThis.litPropertyMetadata.get(o);if(void 0===r&&globalThis.litPropertyMetadata.set(o,r=new Map),"setter"===i&&((t=Object.create(t)).wrapped=!0),r.set(s.name,t),"accessor"===i){const{name:i}=s;return{set(s){const o=e.get.call(this);e.set.call(this,s),this.requestUpdate(i,o,t)},init(e){return void 0!==e&&this.C(i,void 0,t,e),e}}}if("setter"===i){const{name:i}=s;return function(s){const o=this[i];e.call(this,s),this.requestUpdate(i,o,t)}}throw Error("Unsupported decorator location: "+i)};function ct(t){return(e,s)=>"object"==typeof s?lt(t,e,s):((t,e,s)=>{const i=e.hasOwnProperty(s);return e.constructor.createProperty(s,t),i?Object.getOwnPropertyDescriptor(e,s):void 0})(t,e,s)}function ht(t){return`rgb(${t[0]}, ${t[1]}, ${t[2]})`}function dt(t){if(t.attributes.rgb_color)return ht(t.attributes.rgb_color);if(t.attributes.hs_color){const e=function(t,e){const s=e/=100,i=s*(1-Math.abs(t/60%2-1));let o=0,r=0,n=0;return t>=0&&t<60?(o=s,r=i,n=0):t>=60&&t<120?(o=i,r=s,n=0):t>=120&&t<180?(o=0,r=s,n=i):t>=180&&t<240?(o=0,r=i,n=s):t>=240&&t<300?(o=i,r=0,n=s):t>=300&&t<360&&(o=s,r=0,n=i),[Math.round(255*(o+0)),Math.round(255*(r+0)),Math.round(255*(n+0))]}(t.attributes.hs_color[0],t.attributes.hs_color[1]);return ht(e)}return"rgb(255, 255, 255)"}function pt(t){return Math.round(t/255*100)}function ut(t,e){const s=t.states[e];return s?.attributes?.friendly_name||e}let gt=class extends rt{setConfig(t){if(!t.entity)throw new Error("You need to define an entity (master light)");this._config={layout:"medium",show_brightness:!0,show_next_schedule:!0,show_slave_count:!0,...t,type:"custom:light-sync-card"}}getCardSize(){switch(this._config.layout){case"small":return 2;case"large":return 5;default:return 3}}shouldUpdate(t){if(t.has("_config"))return!0;if(t.has("hass")&&this.hass&&this._config){const e=t.get("hass");if(!e)return!0;const s=this.hass.states[this._config.entity],i=e.states[this._config.entity];return!s||!i||(s.state!==i.state||JSON.stringify(s.attributes)!==JSON.stringify(i.attributes))}return!1}_getSyncSwitchEntity(){const t=this._config.entity;return t.startsWith("light.lsm_")?t.replace("light.lsm_","switch.lsm_"):null}_getSlaveEntities(){return[]}async _toggleSync(){const t=this._getSyncSwitchEntity();if(!t)return;const e=this.hass.states[t],s="on"===e?.state?"turn_off":"turn_on";await this.hass.callService("switch",s,{entity_id:t})}async _adjustBrightness(t){await this.hass.callService("light","turn_on",{entity_id:this._config.entity,brightness:t})}_openPanel(){window.location.href="/light-sync"}_renderSmallLayout(){const t=this.hass.states[this._config.entity];if(!t)return B`<div class="error">Entità non trovata: ${this._config.entity}</div>`;const e=dt(t),s=pt(t.attributes.brightness||255),i=this._getSyncSwitchEntity(),o=!!i&&"on"===this.hass.states[i]?.state;return B`
      <div class="small-layout" @click=${this._openPanel}>
        <div class="color-display" style="background: ${e}">
          <div class="brightness-overlay" style="opacity: ${1-s/100}"></div>
          <div class="sync-indicator ${o?"active":""}">
            <ha-icon icon="mdi:sync"></ha-icon>
          </div>
        </div>
        <div class="info">
          <div class="name">${this._config.name||ut(this.hass,this._config.entity)}</div>
          <div class="brightness">${s}%</div>
        </div>
      </div>
    `}_renderMediumLayout(){const t=this.hass.states[this._config.entity];if(!t)return B`<div class="error">Entità non trovata: ${this._config.entity}</div>`;const e=dt(t),s=pt(t.attributes.brightness||255),i=this._getSyncSwitchEntity(),o=!!i&&"on"===this.hass.states[i]?.state;return B`
      <div class="medium-layout">
        <div class="header" @click=${this._openPanel}>
          <div class="color-preview" style="background: ${e}">
            <div class="brightness-overlay" style="opacity: ${1-s/100}"></div>
          </div>
          <div class="header-info">
            <div class="name">${this._config.name||ut(this.hass,this._config.entity)}</div>
            <div class="subtitle">Master Light</div>
          </div>
          <ha-icon icon="mdi:chevron-right"></ha-icon>
        </div>

        ${this._config.show_brightness?B`
          <div class="brightness-control">
            <ha-icon icon="mdi:brightness-6"></ha-icon>
            <input
              type="range"
              min="1"
              max="255"
              .value=${t.attributes.brightness?.toString()||"255"}
              @input=${t=>{const e=parseInt(t.target.value);this._adjustBrightness(e)}}
              @click=${t=>t.stopPropagation()}
            />
            <span>${s}%</span>
          </div>
        `:""}

        <div class="footer">
          <button class="sync-toggle ${o?"active":""}" @click=${this._toggleSync}>
            <ha-icon icon="mdi:sync"></ha-icon>
            <span>Sync ${o?"ON":"OFF"}</span>
          </button>
          ${this._config.show_slave_count?B`
            <div class="slave-count">
              <ha-icon icon="mdi:lightbulb-multiple"></ha-icon>
              <span>${this._getSlaveEntities().length} luci</span>
            </div>
          `:""}
        </div>
      </div>
    `}_renderLargeLayout(){const t=this.hass.states[this._config.entity];if(!t)return B`<div class="error">Entità non trovata: ${this._config.entity}</div>`;const e=dt(t),s=pt(t.attributes.brightness||255),i=this._getSyncSwitchEntity(),o=!!i&&"on"===this.hass.states[i]?.state,r=t.attributes.rgb_color;return B`
      <div class="large-layout">
        <div class="header" @click=${this._openPanel}>
          <ha-icon icon="mdi:lightbulb-group"></ha-icon>
          <div class="header-info">
            <div class="name">${this._config.name||ut(this.hass,this._config.entity)}</div>
            <div class="subtitle">Light Sync Master</div>
          </div>
          <ha-icon icon="mdi:open-in-new"></ha-icon>
        </div>

        <div class="color-section">
          <div class="color-display-large" style="background: ${e}">
            <div class="brightness-overlay" style="opacity: ${1-s/100}"></div>
          </div>
          <div class="color-info">
            <div class="color-label">Colore Attuale</div>
            <div class="color-value">${r?`RGB(${r.join(", ")})`:"N/A"}</div>
            <div class="brightness-value">${s}%</div>
          </div>
        </div>

        ${this._config.show_brightness?B`
          <div class="brightness-control">
            <div class="control-label">Luminosità</div>
            <div class="slider-row">
              <ha-icon icon="mdi:brightness-5"></ha-icon>
              <input
                type="range"
                min="1"
                max="255"
                .value=${t.attributes.brightness?.toString()||"255"}
                @input=${t=>{const e=parseInt(t.target.value);this._adjustBrightness(e)}}
              />
              <span class="brightness-label">${s}%</span>
            </div>
          </div>
        `:""}

        <div class="sync-section">
          <button class="sync-button ${o?"active":""}" @click=${this._toggleSync}>
            <ha-icon icon="mdi:sync${o?"":"-off"}"></ha-icon>
            <div>
              <div class="sync-label">Sincronizzazione</div>
              <div class="sync-status">${o?"Attiva":"Disattiva"}</div>
            </div>
          </button>
        </div>

        ${this._config.show_slave_count?B`
          <div class="stats-row">
            <div class="stat-item">
              <ha-icon icon="mdi:lightbulb-multiple"></ha-icon>
              <div>
                <div class="stat-value">${this._getSlaveEntities().length}</div>
                <div class="stat-label">Luci Slave</div>
              </div>
            </div>
            <div class="stat-item">
              <ha-icon icon="mdi:lightbulb-on"></ha-icon>
              <div>
                <div class="stat-value">${this._getSlaveEntities().filter(t=>"on"===t.state).length}</div>
                <div class="stat-label">Accese</div>
              </div>
            </div>
          </div>
        `:""}
      </div>
    `}render(){if(!this._config||!this.hass)return B`<div class="error">Configurazione mancante</div>`;const t=this._config.layout||"medium";return B`
      <ha-card>
        ${"small"===t?this._renderSmallLayout():""}
        ${"medium"===t?this._renderMediumLayout():""}
        ${"large"===t?this._renderLargeLayout():""}
      </ha-card>
    `}};gt.styles=((t,...e)=>{const s=1===t.length?t[0]:e.reduce((e,s,i)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+t[i+1],t[0]);return new r(s,t,i)})`
    :host {
      --lsm-primary-color: var(--primary-color);
      --lsm-text-color: var(--primary-text-color);
      --lsm-secondary-text-color: var(--secondary-text-color);
      --lsm-card-background: var(--card-background-color);
      --lsm-divider-color: var(--divider-color);
    }

    ha-card {
      padding: 16px;
      cursor: default;
    }

    .error {
      color: var(--error-color);
      padding: 16px;
      text-align: center;
    }

    /* Small Layout */
    .small-layout {
      display: flex;
      gap: 16px;
      align-items: center;
      cursor: pointer;
    }

    .small-layout .color-display {
      position: relative;
      width: 64px;
      height: 64px;
      border-radius: 50%;
      flex-shrink: 0;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    }

    .brightness-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: black;
      border-radius: inherit;
    }

    .sync-indicator {
      position: absolute;
      bottom: -4px;
      right: -4px;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: var(--lsm-card-background);
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2px solid var(--lsm-card-background);
      color: var(--lsm-secondary-text-color);
    }

    .sync-indicator.active {
      color: var(--lsm-primary-color);
    }

    .small-layout .info {
      flex: 1;
    }

    .small-layout .name {
      font-size: 16px;
      font-weight: 500;
      color: var(--lsm-text-color);
    }

    .small-layout .brightness {
      font-size: 14px;
      color: var(--lsm-secondary-text-color);
    }

    /* Medium Layout */
    .medium-layout {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .header {
      display: flex;
      align-items: center;
      gap: 12px;
      cursor: pointer;
      padding: 4px;
      border-radius: 8px;
      transition: background 0.2s ease;
    }

    .header:hover {
      background: var(--lsm-divider-color);
    }

    .color-preview {
      position: relative;
      width: 48px;
      height: 48px;
      border-radius: 50%;
      flex-shrink: 0;
      box-shadow: 0 2px 6px rgba(0,0,0,0.15);
    }

    .header-info {
      flex: 1;
    }

    .name {
      font-size: 16px;
      font-weight: 500;
      color: var(--lsm-text-color);
    }

    .subtitle {
      font-size: 12px;
      color: var(--lsm-secondary-text-color);
    }

    .brightness-control {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 8px;
      background: var(--secondary-background-color);
      border-radius: 8px;
    }

    .brightness-control input[type="range"] {
      flex: 1;
      height: 4px;
      background: var(--lsm-divider-color);
      border-radius: 2px;
      outline: none;
      -webkit-appearance: none;
    }

    .brightness-control input[type="range"]::-webkit-slider-thumb {
      -webkit-appearance: none;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background: var(--lsm-primary-color);
      cursor: pointer;
    }

    .brightness-control span {
      font-size: 14px;
      font-weight: 500;
      color: var(--lsm-text-color);
      min-width: 40px;
      text-align: right;
    }

    .footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
    }

    .sync-toggle {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      border: 2px solid var(--lsm-divider-color);
      border-radius: 8px;
      background: transparent;
      color: var(--lsm-secondary-text-color);
      cursor: pointer;
      transition: all 0.2s ease;
      font-size: 14px;
      font-weight: 500;
    }

    .sync-toggle:hover {
      background: var(--lsm-divider-color);
    }

    .sync-toggle.active {
      border-color: var(--lsm-primary-color);
      background: var(--lsm-primary-color);
      color: white;
    }

    .slave-count {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 14px;
      color: var(--lsm-secondary-text-color);
    }

    /* Large Layout */
    .large-layout {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .color-section {
      display: flex;
      gap: 16px;
      align-items: center;
    }

    .color-display-large {
      position: relative;
      width: 100px;
      height: 100px;
      border-radius: 16px;
      flex-shrink: 0;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    }

    .color-info {
      flex: 1;
    }

    .color-label {
      font-size: 12px;
      color: var(--lsm-secondary-text-color);
      margin-bottom: 4px;
    }

    .color-value {
      font-size: 16px;
      font-weight: 500;
      color: var(--lsm-text-color);
    }

    .brightness-value {
      font-size: 24px;
      font-weight: 600;
      color: var(--lsm-primary-color);
      margin-top: 4px;
    }

    .control-label {
      font-size: 12px;
      font-weight: 500;
      color: var(--lsm-secondary-text-color);
      margin-bottom: 8px;
      text-transform: uppercase;
    }

    .slider-row {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .brightness-label {
      font-size: 16px;
      font-weight: 600;
      color: var(--lsm-text-color);
      min-width: 50px;
      text-align: right;
    }

    .sync-section {
      border-top: 1px solid var(--lsm-divider-color);
      padding-top: 16px;
    }

    .sync-button {
      display: flex;
      align-items: center;
      gap: 12px;
      width: 100%;
      padding: 12px;
      border: 2px solid var(--lsm-divider-color);
      border-radius: 12px;
      background: transparent;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .sync-button ha-icon {
      font-size: 32px;
      color: var(--lsm-secondary-text-color);
    }

    .sync-button:hover {
      background: var(--lsm-divider-color);
    }

    .sync-button.active {
      border-color: var(--lsm-primary-color);
      background: var(--lsm-primary-color);
    }

    .sync-button.active ha-icon,
    .sync-button.active .sync-label,
    .sync-button.active .sync-status {
      color: white;
    }

    .sync-label {
      font-size: 14px;
      font-weight: 500;
      color: var(--lsm-text-color);
    }

    .sync-status {
      font-size: 12px;
      color: var(--lsm-secondary-text-color);
    }

    .stats-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
      gap: 12px;
    }

    .stat-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
      background: var(--secondary-background-color);
      border-radius: 8px;
    }

    .stat-item ha-icon {
      font-size: 32px;
      color: var(--lsm-primary-color);
    }

    .stat-value {
      font-size: 20px;
      font-weight: 600;
      color: var(--lsm-text-color);
    }

    .stat-label {
      font-size: 11px;
      color: var(--lsm-secondary-text-color);
    }
  `,t([ct({attribute:!1})],gt.prototype,"hass",void 0),t([function(t){return ct({...t,state:!0,attribute:!1})}()],gt.prototype,"_config",void 0),gt=t([(t=>(e,s)=>{void 0!==s?s.addInitializer(()=>{customElements.define(t,e)}):customElements.define(t,e)})("light-sync-card")],gt),window.customCards=window.customCards||[],window.customCards.push({type:"light-sync-card",name:"Light Sync Master Card",description:"Card per il controllo del Light Sync Master",preview:!0,documentationURL:"https://github.com/gabry-ts/ha-light-sync-master"}),window.customElements.define("light-sync-card",gt);export{gt as LightSyncCard};
