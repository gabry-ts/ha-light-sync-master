function t(t,e,i,s){var o,a=arguments.length,r=a<3?e:null===s?s=Object.getOwnPropertyDescriptor(e,i):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(t,e,i,s);else for(var n=t.length-1;n>=0;n--)(o=t[n])&&(r=(a<3?o(r):a>3?o(e,i,r):o(e,i))||r);return a>3&&r&&Object.defineProperty(e,i,r),r}"function"==typeof SuppressedError&&SuppressedError;const e=globalThis,i=e.ShadowRoot&&(void 0===e.ShadyCSS||e.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s=Symbol(),o=new WeakMap;let a=class{constructor(t,e,i){if(this._$cssResult$=!0,i!==s)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(i&&void 0===t){const i=void 0!==e&&1===e.length;i&&(t=o.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&o.set(e,t))}return t}toString(){return this.cssText}};const r=(t,...e)=>{const i=1===t.length?t[0]:e.reduce((e,i,s)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[s+1],t[0]);return new a(i,t,s)},n=i?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return(t=>new a("string"==typeof t?t:t+"",void 0,s))(e)})(t):t,{is:c,defineProperty:l,getOwnPropertyDescriptor:d,getOwnPropertyNames:h,getOwnPropertySymbols:p,getPrototypeOf:v}=Object,g=globalThis,u=g.trustedTypes,b=u?u.emptyScript:"",m=g.reactiveElementPolyfillSupport,f=(t,e)=>t,y={toAttribute(t,e){switch(e){case Boolean:t=t?b:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},x=(t,e)=>!c(t,e),_={attribute:!0,type:String,converter:y,reflect:!1,useDefault:!1,hasChanged:x};Symbol.metadata??=Symbol("metadata"),g.litPropertyMetadata??=new WeakMap;let $=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=_){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const i=Symbol(),s=this.getPropertyDescriptor(t,i,e);void 0!==s&&l(this.prototype,t,s)}}static getPropertyDescriptor(t,e,i){const{get:s,set:o}=d(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:s,set(e){const a=s?.call(this);o?.call(this,e),this.requestUpdate(t,a,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??_}static _$Ei(){if(this.hasOwnProperty(f("elementProperties")))return;const t=v(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(f("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(f("properties"))){const t=this.properties,e=[...h(t),...p(t)];for(const i of e)this.createProperty(i,t[i])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,i]of e)this.elementProperties.set(t,i)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const i=this._$Eu(t,e);void 0!==i&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift(n(t))}else void 0!==t&&e.push(n(t));return e}static _$Eu(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((t,s)=>{if(i)t.adoptedStyleSheets=s.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const i of s){const s=document.createElement("style"),o=e.litNonce;void 0!==o&&s.setAttribute("nonce",o),s.textContent=i.cssText,t.appendChild(s)}})(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$ET(t,e){const i=this.constructor.elementProperties.get(t),s=this.constructor._$Eu(t,i);if(void 0!==s&&!0===i.reflect){const o=(void 0!==i.converter?.toAttribute?i.converter:y).toAttribute(e,i.type);this._$Em=t,null==o?this.removeAttribute(s):this.setAttribute(s,o),this._$Em=null}}_$AK(t,e){const i=this.constructor,s=i._$Eh.get(t);if(void 0!==s&&this._$Em!==s){const t=i.getPropertyOptions(s),o="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:y;this._$Em=s;const a=o.fromAttribute(e,t.type);this[s]=a??this._$Ej?.get(s)??a,this._$Em=null}}requestUpdate(t,e,i){if(void 0!==t){const s=this.constructor,o=this[t];if(i??=s.getPropertyOptions(t),!((i.hasChanged??x)(o,e)||i.useDefault&&i.reflect&&o===this._$Ej?.get(t)&&!this.hasAttribute(s._$Eu(t,i))))return;this.C(t,e,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:i,reflect:s,wrapped:o},a){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,a??e??this[t]),!0!==o||void 0!==a)||(this._$AL.has(t)||(this.hasUpdated||i||(e=void 0),this._$AL.set(t,e)),!0===s&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,i]of t){const{wrapped:t}=i,s=this[e];!0!==t||this._$AL.has(e)||void 0===s||this.C(e,void 0,i,s)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};$.elementStyles=[],$.shadowRootOptions={mode:"open"},$[f("elementProperties")]=new Map,$[f("finalized")]=new Map,m?.({ReactiveElement:$}),(g.reactiveElementVersions??=[]).push("2.1.1");const w=globalThis,k=w.trustedTypes,S=k?k.createPolicy("lit-html",{createHTML:t=>t}):void 0,A="$lit$",z=`lit$${Math.random().toFixed(9).slice(2)}$`,E="?"+z,C=`<${E}>`,T=document,M=()=>T.createComment(""),O=t=>null===t||"object"!=typeof t&&"function"!=typeof t,L=Array.isArray,P="[ \t\n\f\r]",N=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,U=/-->/g,I=/>/g,D=RegExp(`>|${P}(?:([^\\s"'>=/]+)(${P}*=${P}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),j=/'/g,R=/"/g,H=/^(?:script|style|textarea|title)$/i,B=(t=>(e,...i)=>({_$litType$:t,strings:e,values:i}))(1),V=Symbol.for("lit-noChange"),W=Symbol.for("lit-nothing"),q=new WeakMap,F=T.createTreeWalker(T,129);function G(t,e){if(!L(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==S?S.createHTML(e):e}const J=(t,e)=>{const i=t.length-1,s=[];let o,a=2===e?"<svg>":3===e?"<math>":"",r=N;for(let e=0;e<i;e++){const i=t[e];let n,c,l=-1,d=0;for(;d<i.length&&(r.lastIndex=d,c=r.exec(i),null!==c);)d=r.lastIndex,r===N?"!--"===c[1]?r=U:void 0!==c[1]?r=I:void 0!==c[2]?(H.test(c[2])&&(o=RegExp("</"+c[2],"g")),r=D):void 0!==c[3]&&(r=D):r===D?">"===c[0]?(r=o??N,l=-1):void 0===c[1]?l=-2:(l=r.lastIndex-c[2].length,n=c[1],r=void 0===c[3]?D:'"'===c[3]?R:j):r===R||r===j?r=D:r===U||r===I?r=N:(r=D,o=void 0);const h=r===D&&t[e+1].startsWith("/>")?" ":"";a+=r===N?i+C:l>=0?(s.push(n),i.slice(0,l)+A+i.slice(l)+z+h):i+z+(-2===l?e:h)}return[G(t,a+(t[i]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),s]};class K{constructor({strings:t,_$litType$:e},i){let s;this.parts=[];let o=0,a=0;const r=t.length-1,n=this.parts,[c,l]=J(t,e);if(this.el=K.createElement(c,i),F.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(s=F.nextNode())&&n.length<r;){if(1===s.nodeType){if(s.hasAttributes())for(const t of s.getAttributeNames())if(t.endsWith(A)){const e=l[a++],i=s.getAttribute(t).split(z),r=/([.?@])?(.*)/.exec(e);n.push({type:1,index:o,name:r[2],strings:i,ctor:"."===r[1]?tt:"?"===r[1]?et:"@"===r[1]?it:Q}),s.removeAttribute(t)}else t.startsWith(z)&&(n.push({type:6,index:o}),s.removeAttribute(t));if(H.test(s.tagName)){const t=s.textContent.split(z),e=t.length-1;if(e>0){s.textContent=k?k.emptyScript:"";for(let i=0;i<e;i++)s.append(t[i],M()),F.nextNode(),n.push({type:2,index:++o});s.append(t[e],M())}}}else if(8===s.nodeType)if(s.data===E)n.push({type:2,index:o});else{let t=-1;for(;-1!==(t=s.data.indexOf(z,t+1));)n.push({type:7,index:o}),t+=z.length-1}o++}}static createElement(t,e){const i=T.createElement("template");return i.innerHTML=t,i}}function Y(t,e,i=t,s){if(e===V)return e;let o=void 0!==s?i._$Co?.[s]:i._$Cl;const a=O(e)?void 0:e._$litDirective$;return o?.constructor!==a&&(o?._$AO?.(!1),void 0===a?o=void 0:(o=new a(t),o._$AT(t,i,s)),void 0!==s?(i._$Co??=[])[s]=o:i._$Cl=o),void 0!==o&&(e=Y(t,o._$AS(t,e.values),o,s)),e}class X{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:i}=this._$AD,s=(t?.creationScope??T).importNode(e,!0);F.currentNode=s;let o=F.nextNode(),a=0,r=0,n=i[0];for(;void 0!==n;){if(a===n.index){let e;2===n.type?e=new Z(o,o.nextSibling,this,t):1===n.type?e=new n.ctor(o,n.name,n.strings,this,t):6===n.type&&(e=new st(o,this,t)),this._$AV.push(e),n=i[++r]}a!==n?.index&&(o=F.nextNode(),a++)}return F.currentNode=T,s}p(t){let e=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class Z{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,i,s){this.type=2,this._$AH=W,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=Y(this,t,e),O(t)?t===W||null==t||""===t?(this._$AH!==W&&this._$AR(),this._$AH=W):t!==this._$AH&&t!==V&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>L(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==W&&O(this._$AH)?this._$AA.nextSibling.data=t:this.T(T.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:i}=t,s="number"==typeof i?this._$AC(t):(void 0===i.el&&(i.el=K.createElement(G(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===s)this._$AH.p(e);else{const t=new X(s,this),i=t.u(this.options);t.p(e),this.T(i),this._$AH=t}}_$AC(t){let e=q.get(t.strings);return void 0===e&&q.set(t.strings,e=new K(t)),e}k(t){L(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,s=0;for(const o of t)s===e.length?e.push(i=new Z(this.O(M()),this.O(M()),this,this.options)):i=e[s],i._$AI(o),s++;s<e.length&&(this._$AR(i&&i._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=t.nextSibling;t.remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class Q{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,s,o){this.type=1,this._$AH=W,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=o,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=W}_$AI(t,e=this,i,s){const o=this.strings;let a=!1;if(void 0===o)t=Y(this,t,e,0),a=!O(t)||t!==this._$AH&&t!==V,a&&(this._$AH=t);else{const s=t;let r,n;for(t=o[0],r=0;r<o.length-1;r++)n=Y(this,s[i+r],e,r),n===V&&(n=this._$AH[r]),a||=!O(n)||n!==this._$AH[r],n===W?t=W:t!==W&&(t+=(n??"")+o[r+1]),this._$AH[r]=n}a&&!s&&this.j(t)}j(t){t===W?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class tt extends Q{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===W?void 0:t}}class et extends Q{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==W)}}class it extends Q{constructor(t,e,i,s,o){super(t,e,i,s,o),this.type=5}_$AI(t,e=this){if((t=Y(this,t,e,0)??W)===V)return;const i=this._$AH,s=t===W&&i!==W||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,o=t!==W&&(i===W||s);s&&this.element.removeEventListener(this.name,this,i),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class st{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){Y(this,t)}}const ot=w.litHtmlPolyfillSupport;ot?.(K,Z),(w.litHtmlVersions??=[]).push("3.3.1");const at=globalThis;class rt extends ${constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,i)=>{const s=i?.renderBefore??e;let o=s._$litPart$;if(void 0===o){const t=i?.renderBefore??null;s._$litPart$=o=new Z(e.insertBefore(M(),t),t,void 0,i??{})}return o._$AI(t),o})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return V}}rt._$litElement$=!0,rt.finalized=!0,at.litElementHydrateSupport?.({LitElement:rt});const nt=at.litElementPolyfillSupport;nt?.({LitElement:rt}),(at.litElementVersions??=[]).push("4.2.1");const ct=t=>(e,i)=>{void 0!==i?i.addInitializer(()=>{customElements.define(t,e)}):customElements.define(t,e)},lt={attribute:!0,type:String,converter:y,reflect:!1,hasChanged:x},dt=(t=lt,e,i)=>{const{kind:s,metadata:o}=i;let a=globalThis.litPropertyMetadata.get(o);if(void 0===a&&globalThis.litPropertyMetadata.set(o,a=new Map),"setter"===s&&((t=Object.create(t)).wrapped=!0),a.set(i.name,t),"accessor"===s){const{name:s}=i;return{set(i){const o=e.get.call(this);e.set.call(this,i),this.requestUpdate(s,o,t)},init(e){return void 0!==e&&this.C(s,void 0,t,e),e}}}if("setter"===s){const{name:s}=i;return function(i){const o=this[s];e.call(this,i),this.requestUpdate(s,o,t)}}throw Error("Unsupported decorator location: "+s)};function ht(t){return(e,i)=>"object"==typeof i?dt(t,e,i):((t,e,i)=>{const s=e.hasOwnProperty(i);return e.constructor.createProperty(i,t),s?Object.getOwnPropertyDescriptor(e,i):void 0})(t,e,i)}function pt(t){return ht({...t,state:!0,attribute:!1})}const vt=r`
  :host {
    --primary-color: var(--primary-color);
    --accent-color: var(--accent-color);
    --primary-text-color: var(--primary-text-color);
    --secondary-text-color: var(--secondary-text-color);
    --disabled-text-color: var(--disabled-text-color);
    --divider-color: var(--divider-color);
    --card-background-color: var(--card-background-color);
    --primary-background-color: var(--primary-background-color);
    --secondary-background-color: var(--secondary-background-color);
    --state-icon-color: var(--state-icon-color);
    --state-icon-active-color: var(--state-icon-active-color);

    --ha-card-border-radius: 12px;
    --mdc-theme-primary: var(--primary-color);
    --mdc-theme-secondary: var(--accent-color);
  }

  * {
    box-sizing: border-box;
  }

  .card {
    background: var(--card-background-color);
    border-radius: var(--ha-card-border-radius);
    padding: 16px;
    margin: 8px 0;
    box-shadow: var(--ha-card-box-shadow, 0 2px 4px rgba(0,0,0,0.1));
  }

  .section {
    margin: 16px 0;
  }

  .section-title {
    font-size: 18px;
    font-weight: 500;
    color: var(--primary-text-color);
    margin: 0 0 12px 0;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .section-title ha-icon {
    color: var(--primary-color);
  }

  .row {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 8px 0;
  }

  .row.space-between {
    justify-content: space-between;
  }

  .col {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .grid {
    display: grid;
    gap: 16px;
  }

  .grid-2 {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  }

  .grid-3 {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }

  .grid-4 {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  }

  /* Buttons */
  .button {
    padding: 8px 16px;
    border: none;
    border-radius: 8px;
    background: var(--primary-color);
    color: white;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    transition: all 0.2s ease;
  }

  .button:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }

  .button:active {
    transform: translateY(0);
  }

  .button.secondary {
    background: var(--secondary-background-color);
    color: var(--primary-text-color);
  }

  .button.danger {
    background: var(--error-color, #f44336);
  }

  .button.small {
    padding: 4px 12px;
    font-size: 12px;
  }

  .icon-button {
    width: 40px;
    height: 40px;
    border: none;
    border-radius: 50%;
    background: var(--secondary-background-color);
    color: var(--primary-text-color);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
  }

  .icon-button:hover {
    background: var(--divider-color);
  }

  /* Stats */
  .stat-card {
    background: var(--card-background-color);
    border-radius: var(--ha-card-border-radius);
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    box-shadow: var(--ha-card-box-shadow, 0 2px 4px rgba(0,0,0,0.1));
  }

  .stat-value {
    font-size: 32px;
    font-weight: 600;
    color: var(--primary-text-color);
    line-height: 1;
  }

  .stat-label {
    font-size: 14px;
    color: var(--secondary-text-color);
  }

  .stat-icon {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--primary-color);
    color: white;
  }

  /* Badges */
  .badge {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 4px 12px;
    border-radius: 16px;
    font-size: 12px;
    font-weight: 500;
    background: var(--secondary-background-color);
    color: var(--primary-text-color);
  }

  .badge.success {
    background: rgba(76, 175, 80, 0.2);
    color: #4caf50;
  }

  .badge.error {
    background: rgba(244, 67, 54, 0.2);
    color: #f44336;
  }

  .badge.warning {
    background: rgba(255, 152, 0, 0.2);
    color: #ff9800;
  }

  .badge.info {
    background: rgba(33, 150, 243, 0.2);
    color: #2196f3;
  }

  /* Toggle Switch */
  .toggle-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px;
    background: var(--card-background-color);
    border-radius: 8px;
  }

  /* List Items */
  .list-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px;
    background: var(--card-background-color);
    border-radius: 8px;
    cursor: pointer;
    transition: background 0.2s ease;
  }

  .list-item:hover {
    background: var(--secondary-background-color);
  }

  .list-item-icon {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--secondary-background-color);
  }

  .list-item-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .list-item-title {
    font-size: 14px;
    font-weight: 500;
    color: var(--primary-text-color);
  }

  .list-item-subtitle {
    font-size: 12px;
    color: var(--secondary-text-color);
  }

  /* Color Preview */
  .color-preview {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: 2px solid var(--divider-color);
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }

  .color-preview.large {
    width: 64px;
    height: 64px;
  }

  /* Loading */
  .loading {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 32px;
  }

  .spinner {
    width: 40px;
    height: 40px;
    border: 4px solid var(--divider-color);
    border-top-color: var(--primary-color);
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  /* Empty State */
  .empty-state {
    text-align: center;
    padding: 48px 16px;
    color: var(--secondary-text-color);
  }

  .empty-state ha-icon {
    font-size: 64px;
    color: var(--disabled-text-color);
    margin-bottom: 16px;
  }

  /* Divider */
  .divider {
    height: 1px;
    background: var(--divider-color);
    margin: 16px 0;
  }

  /* Scrollbar */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: var(--secondary-background-color);
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb {
    background: var(--divider-color);
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: var(--secondary-text-color);
  }

  /* Responsive */
  @media (max-width: 768px) {
    .grid-2,
    .grid-3,
    .grid-4 {
      grid-template-columns: 1fr;
    }

    .card {
      margin: 4px 0;
      padding: 12px;
    }
  }
`;function gt(t){return`rgb(${t[0]}, ${t[1]}, ${t[2]})`}function ut(t){if(t.attributes.rgb_color)return gt(t.attributes.rgb_color);if(t.attributes.hs_color){const e=function(t,e){const i=e/=100,s=i*(1-Math.abs(t/60%2-1));let o=0,a=0,r=0;return t>=0&&t<60?(o=i,a=s,r=0):t>=60&&t<120?(o=s,a=i,r=0):t>=120&&t<180?(o=0,a=i,r=s):t>=180&&t<240?(o=0,a=s,r=i):t>=240&&t<300?(o=s,a=0,r=i):t>=300&&t<360&&(o=i,a=0,r=s),[Math.round(255*(o+0)),Math.round(255*(a+0)),Math.round(255*(r+0))]}(t.attributes.hs_color[0],t.attributes.hs_color[1]);return gt(e)}return"rgb(255, 255, 255)"}function bt(t){const e=new Date,i=new Date(t),s=e.getTime()-i.getTime(),o=Math.floor(s/1e3),a=Math.floor(o/60),r=Math.floor(a/60),n=Math.floor(r/24);return o<60?`${o}s fa`:a<60?`${a}m fa`:r<24?`${r}h fa`:`${n}g fa`}function mt(t,e=!1){return e?["Lun","Mar","Mer","Gio","Ven","Sab","Dom"][t]:["Lunedì","Martedì","Mercoledì","Giovedì","Venerdì","Sabato","Domenica"][t]}function ft(t){let e="",i="";return"time"===t.from_type?e=t.from_time||"00:00":"sunrise"===t.from_type?e=`🌅 ${t.from_offset>0?"+":""}${t.from_offset}m`:"sunset"===t.from_type&&(e=`🌇 ${t.from_offset>0?"+":""}${t.from_offset}m`),"time"===t.to_type?i=t.to_time||"00:00":"sunrise"===t.to_type?i=`🌅 ${t.to_offset>0?"+":""}${t.to_offset}m`:"sunset"===t.to_type&&(i=`🌇 ${t.to_offset>0?"+":""}${t.to_offset}m`),`${e} → ${i}`}function yt(t){return Math.round(t/255*100)}async function xt(t,e){return await t.callApi("GET",e)}async function _t(t,e,i){return await t.callApi("POST",e,i)}function $t(t,e){const i=t.states[e];return i?.attributes?.friendly_name||e}let wt=class extends rt{async _toggleSync(){const t=this.status.sync_switch.entity_id,e=this.status.sync_switch.state?"turn_off":"turn_on";await this.hass.callService("switch",e,{entity_id:t})}async _adjustBrightness(t){const e=this.status.master_light.entity_id;await this.hass.callService("light","turn_on",{entity_id:e,brightness:t})}_renderStatistics(){const t=this.status.statistics;return B`
      <div class="section">
        <h2 class="section-title">
          <ha-icon icon="mdi:chart-line"></ha-icon>
          Statistiche
        </h2>
        <div class="grid grid-4">
          <div class="stat-card">
            <div class="row space-between">
              <div class="col">
                <div class="stat-value">${t.active_lights}</div>
                <div class="stat-label">Luci Attive</div>
              </div>
              <div class="stat-icon">
                <ha-icon icon="mdi:lightbulb-on"></ha-icon>
              </div>
            </div>
          </div>

          <div class="stat-card">
            <div class="row space-between">
              <div class="col">
                <div class="stat-value">${t.total_lights}</div>
                <div class="stat-label">Totale Luci</div>
              </div>
              <div class="stat-icon">
                <ha-icon icon="mdi:lightbulb-group"></ha-icon>
              </div>
            </div>
          </div>

          <div class="stat-card">
            <div class="row space-between">
              <div class="col">
                <div class="stat-value">${t.syncs_today}</div>
                <div class="stat-label">Sync Oggi</div>
              </div>
              <div class="stat-icon">
                <ha-icon icon="mdi:sync"></ha-icon>
              </div>
            </div>
          </div>

          <div class="stat-card">
            <div class="row space-between">
              <div class="col">
                <div class="stat-value">${t.total_syncs}</div>
                <div class="stat-label">Sync Totali</div>
              </div>
              <div class="stat-icon">
                <ha-icon icon="mdi:counter"></ha-icon>
              </div>
            </div>
          </div>
        </div>
      </div>
    `}_renderMasterLight(){const t=this.status.master_light,e=ut(this.hass.states[t.entity_id]),i=yt(t.brightness);return B`
      <div class="section">
        <h2 class="section-title">
          <ha-icon icon="mdi:lightbulb"></ha-icon>
          Master Light
        </h2>
        <div class="card">
          <div class="master-light-display">
            <div class="color-display" style="background: ${e}">
              <div class="brightness-overlay" style="opacity: ${1-i/100}"></div>
            </div>
            <div class="master-info">
              <div class="master-name">${$t(this.hass,t.entity_id)}</div>
              <div class="master-details">
                <div class="detail-item">
                  <ha-icon icon="mdi:brightness-6"></ha-icon>
                  <span>${i}%</span>
                </div>
                ${t.rgb_color?B`
                  <div class="detail-item">
                    <ha-icon icon="mdi:palette"></ha-icon>
                    <span>RGB(${t.rgb_color.join(", ")})</span>
                  </div>
                `:""}
              </div>
              <div class="brightness-control">
                <ha-icon icon="mdi:brightness-5"></ha-icon>
                <input
                  type="range"
                  min="1"
                  max="255"
                  .value=${t.brightness.toString()}
                  @input=${t=>{const e=parseInt(t.target.value);this._adjustBrightness(e)}}
                />
                <span>${i}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `}_renderSyncControl(){const t=this.status.sync_switch.state;return B`
      <div class="section">
        <h2 class="section-title">
          <ha-icon icon="mdi:sync"></ha-icon>
          Sincronizzazione
        </h2>
        <div class="card">
          <div class="sync-control">
            <div class="sync-status">
              <ha-icon icon="mdi:${t?"sync":"sync-off"}"></ha-icon>
              <div class="col">
                <div class="sync-label">Sincronizzazione ${t?"Attiva":"Disattiva"}</div>
                ${this.status.last_sync?B`
                  <div class="sync-time">Ultima sync: ${bt(this.status.last_sync)}</div>
                `:B`
                  <div class="sync-time">Nessuna sincronizzazione recente</div>
                `}
              </div>
            </div>
            <ha-switch
              .checked=${t}
              @change=${this._toggleSync}
            ></ha-switch>
          </div>
        </div>
      </div>
    `}_renderSlaveStatus(){const t=this.status.slave_lights;return B`
      <div class="section">
        <h2 class="section-title">
          <ha-icon icon="mdi:lightbulb-multiple"></ha-icon>
          Stato Luci Slave
        </h2>
        <div class="slaves-grid">
          ${t.map(t=>{const e=t.rgb_color?`rgb(${t.rgb_color.join(",")})`:"#ccc",i="on"===t.state;return B`
              <div class="slave-card ${t.available?"":"unavailable"}">
                <div class="slave-header">
                  <div class="color-preview" style="background: ${i?e:"#333"}"></div>
                  <div class="slave-name">${t.name}</div>
                  <span class="badge ${i?"success":""}">
                    ${i?"ON":"OFF"}
                  </span>
                </div>
                <div class="slave-details">
                  ${i&&t.brightness?B`
                    <div class="detail-row">
                      <ha-icon icon="mdi:brightness-6"></ha-icon>
                      <span>${yt(t.brightness)}%</span>
                    </div>
                  `:""}
                  <div class="detail-row">
                    <ha-icon icon="mdi:${t.is_synced?"check-circle":"close-circle"}"></ha-icon>
                    <span>${t.is_synced?"Sincronizzato":"Non sincronizzato"}</span>
                  </div>
                  ${t.available?"":B`
                    <div class="detail-row error">
                      <ha-icon icon="mdi:alert"></ha-icon>
                      <span>Non disponibile</span>
                    </div>
                  `}
                </div>
              </div>
            `})}
        </div>
      </div>
    `}_renderNextSchedule(){if(!this.status.next_schedule)return B``;const t=this.status.next_schedule,e=`rgb(${t.rgb_color.join(",")})`,i=yt(t.brightness);return B`
      <div class="section">
        <h2 class="section-title">
          <ha-icon icon="mdi:clock-check"></ha-icon>
          Prossima Schedule
        </h2>
        <div class="card next-schedule">
          <div class="row space-between">
            <div class="col" style="flex: 1">
              <div class="schedule-name">${t.name}</div>
              <div class="schedule-time">
                <ha-icon icon="mdi:clock-outline"></ha-icon>
                ${new Date(t.trigger_time).toLocaleString("it-IT")}
              </div>
            </div>
            <div class="schedule-preview">
              <div class="color-preview large" style="background: ${e}">
                <div class="brightness-overlay" style="opacity: ${1-i/100}"></div>
              </div>
              <div class="schedule-brightness">${i}%</div>
            </div>
          </div>
        </div>
      </div>
    `}render(){return B`
      <div class="dashboard">
        ${this._renderStatistics()}
        <div class="grid grid-2">
          <div>
            ${this._renderMasterLight()}
            ${this._renderSyncControl()}
          </div>
          <div>
            ${this._renderNextSchedule()}
            ${this._renderSlaveStatus()}
          </div>
        </div>
      </div>
    `}};wt.styles=[vt,r`
      .dashboard {
        max-width: 1400px;
        margin: 0 auto;
      }

      .master-light-display {
        display: flex;
        gap: 24px;
        align-items: center;
      }

      .color-display {
        position: relative;
        width: 120px;
        height: 120px;
        border-radius: 50%;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        flex-shrink: 0;
      }

      .brightness-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: black;
        border-radius: 50%;
        pointer-events: none;
      }

      .master-info {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .master-name {
        font-size: 20px;
        font-weight: 500;
        color: var(--primary-text-color);
      }

      .master-details {
        display: flex;
        gap: 16px;
        flex-wrap: wrap;
      }

      .detail-item {
        display: flex;
        align-items: center;
        gap: 6px;
        color: var(--secondary-text-color);
        font-size: 14px;
      }

      .brightness-control {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px;
        background: var(--secondary-background-color);
        border-radius: 8px;
      }

      .brightness-control input[type="range"] {
        flex: 1;
        height: 4px;
        background: var(--divider-color);
        border-radius: 2px;
        outline: none;
        -webkit-appearance: none;
      }

      .brightness-control input[type="range"]::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background: var(--primary-color);
        cursor: pointer;
      }

      .sync-control {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 16px;
      }

      .sync-status {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .sync-status ha-icon {
        font-size: 32px;
        color: var(--primary-color);
      }

      .sync-label {
        font-size: 16px;
        font-weight: 500;
        color: var(--primary-text-color);
      }

      .sync-time {
        font-size: 12px;
        color: var(--secondary-text-color);
      }

      .slaves-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 12px;
      }

      .slave-card {
        background: var(--card-background-color);
        border-radius: 8px;
        padding: 12px;
        border: 1px solid var(--divider-color);
      }

      .slave-card.unavailable {
        opacity: 0.5;
      }

      .slave-header {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 8px;
      }

      .slave-name {
        flex: 1;
        font-weight: 500;
        font-size: 14px;
        color: var(--primary-text-color);
      }

      .slave-details {
        display: flex;
        flex-direction: column;
        gap: 4px;
        padding-left: 44px;
      }

      .detail-row {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 12px;
        color: var(--secondary-text-color);
      }

      .detail-row.error {
        color: var(--error-color, #f44336);
      }

      .next-schedule {
        background: linear-gradient(135deg, var(--primary-color) 0%, var(--accent-color) 100%);
        color: white;
      }

      .schedule-name {
        font-size: 18px;
        font-weight: 500;
      }

      .schedule-time {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 14px;
        opacity: 0.9;
      }

      .schedule-preview {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
      }

      .schedule-brightness {
        font-size: 14px;
        font-weight: 500;
      }

      @media (max-width: 768px) {
        .master-light-display {
          flex-direction: column;
          text-align: center;
        }

        .slaves-grid {
          grid-template-columns: 1fr;
        }
      }
    `],t([ht({attribute:!1})],wt.prototype,"hass",void 0),t([ht({attribute:!1})],wt.prototype,"status",void 0),t([ht({attribute:!1})],wt.prototype,"config",void 0),t([ht({type:String})],wt.prototype,"entryId",void 0),wt=t([ct("dashboard-tab")],wt);let kt=class extends rt{constructor(){super(...arguments),this._editMode=!1,this._selectedSlaves=[],this._transitionTime=1,this._syncOnEnable=!0,this._saving=!1}connectedCallback(){super.connectedCallback(),this._selectedSlaves=[...this.config.slave_entities],this._transitionTime=this.config.transition_time,this._syncOnEnable=this.config.sync_on_enable}_getAllLightEntities(){return Object.keys(this.hass.states).filter(t=>t.startsWith("light.")&&t!==this.status.master_light.entity_id)}_toggleSlaveSelection(t){this._selectedSlaves.includes(t)?this._selectedSlaves=this._selectedSlaves.filter(e=>e!==t):this._selectedSlaves=[...this._selectedSlaves,t],this.requestUpdate()}async _saveConfiguration(){try{this._saving=!0,await _t(this.hass,`/api/light_sync_master/${this.entryId}/update_config`,{slave_entities:this._selectedSlaves,transition_time:this._transitionTime,sync_on_enable:this._syncOnEnable}),this._editMode=!1,this.dispatchEvent(new CustomEvent("config-changed"))}catch(t){console.error("Error saving configuration:",t),alert("Errore nel salvataggio della configurazione")}finally{this._saving=!1}}_cancelEdit(){this._editMode=!1,this._selectedSlaves=[...this.config.slave_entities],this._transitionTime=this.config.transition_time,this._syncOnEnable=this.config.sync_on_enable}async _testSync(){try{await _t(this.hass,`/api/light_sync_master/${this.entryId}/test_sync`,{}),alert("Test sincronizzazione avviato!")}catch(t){console.error("Error testing sync:",t),alert("Errore nel test di sincronizzazione")}}_renderMasterLightInfo(){const t=this.status.master_light;return B`
      <div class="section">
        <h2 class="section-title">
          <ha-icon icon="mdi:lightbulb"></ha-icon>
          Master Light
        </h2>
        <div class="card">
          <div class="info-row">
            <div class="info-label">Entity ID</div>
            <div class="info-value">${t.entity_id}</div>
          </div>
          <div class="divider"></div>
          <div class="info-row">
            <div class="info-label">Nome</div>
            <div class="info-value">${$t(this.hass,t.entity_id)}</div>
          </div>
          <div class="divider"></div>
          <div class="info-row">
            <div class="info-label">Stato</div>
            <div class="info-value">
              <span class="badge success">Sempre ON</span>
            </div>
          </div>
        </div>
      </div>
    `}_renderSlaveConfiguration(){if(!this._editMode)return B`
        <div class="section">
          <div class="row space-between">
            <h2 class="section-title">
              <ha-icon icon="mdi:lightbulb-multiple"></ha-icon>
              Luci Slave (${this.config.slave_entities.length})
            </h2>
            <button class="button" @click=${()=>this._editMode=!0}>
              <ha-icon icon="mdi:pencil"></ha-icon>
              Modifica
            </button>
          </div>
          <div class="slaves-list">
            ${this.config.slave_entities.map(t=>B`
              <div class="list-item">
                <div class="list-item-icon">
                  <ha-icon icon="mdi:lightbulb"></ha-icon>
                </div>
                <div class="list-item-content">
                  <div class="list-item-title">${$t(this.hass,t)}</div>
                  <div class="list-item-subtitle">${t}</div>
                </div>
                <span class="badge ${"on"===this.hass.states[t]?.state?"success":""}">
                  ${this.hass.states[t]?.state?.toUpperCase()||"UNKNOWN"}
                </span>
              </div>
            `)}
          </div>
        </div>
      `;const t=this._getAllLightEntities();return B`
      <div class="section">
        <div class="row space-between">
          <h2 class="section-title">
            <ha-icon icon="mdi:lightbulb-multiple"></ha-icon>
            Seleziona Luci Slave
          </h2>
          <div class="row" style="gap: 8px">
            <button class="button secondary" @click=${this._cancelEdit}>
              <ha-icon icon="mdi:close"></ha-icon>
              Annulla
            </button>
            <button class="button" @click=${this._saveConfiguration} ?disabled=${this._saving}>
              <ha-icon icon="mdi:check"></ha-icon>
              ${this._saving?"Salvataggio...":"Salva"}
            </button>
          </div>
        </div>
        <div class="card">
          <div class="selection-info">
            ${this._selectedSlaves.length} luc${1===this._selectedSlaves.length?"e":"i"} selezionat${1===this._selectedSlaves.length?"a":"e"}
          </div>
        </div>
        <div class="lights-selector">
          ${t.map(t=>{const e=this._selectedSlaves.includes(t),i=this.hass.states[t],s="on"===i?.state;return B`
              <div class="selectable-light ${e?"selected":""}" @click=${()=>this._toggleSlaveSelection(t)}>
                <div class="checkbox">
                  <ha-icon icon="mdi:${e?"checkbox-marked":"checkbox-blank-outline"}"></ha-icon>
                </div>
                <div class="list-item-icon">
                  <ha-icon icon="mdi:lightbulb${s?"":"-outline"}"></ha-icon>
                </div>
                <div class="list-item-content">
                  <div class="list-item-title">${$t(this.hass,t)}</div>
                  <div class="list-item-subtitle">${t}</div>
                </div>
                <span class="badge ${s?"success":""}">
                  ${i?.state?.toUpperCase()||"UNKNOWN"}
                </span>
              </div>
            `})}
        </div>
      </div>
    `}_renderBehaviorSettings(){return B`
      <div class="section">
        <h2 class="section-title">
          <ha-icon icon="mdi:cog"></ha-icon>
          Impostazioni Comportamento
        </h2>
        <div class="card">
          <div class="toggle-row">
            <div class="col">
              <div class="setting-title">Sincronizza all'attivazione</div>
              <div class="setting-description">
                Sincronizza automaticamente tutte le luci accese quando si attiva lo switch
              </div>
            </div>
            <ha-switch
              .checked=${this._syncOnEnable}
              @change=${t=>{this._syncOnEnable=t.target.checked,this._editMode||this._saveConfiguration()}}
            ></ha-switch>
          </div>
        </div>
      </div>
    `}_renderTransitionSettings(){return B`
      <div class="section">
        <h2 class="section-title">
          <ha-icon icon="mdi:timer"></ha-icon>
          Tempo di Transizione
        </h2>
        <div class="card">
          <div class="transition-control">
            <div class="transition-info">
              <div class="transition-value">${this._transitionTime.toFixed(1)}s</div>
              <div class="transition-label">Durata transizione</div>
            </div>
            <input
              type="range"
              min="0"
              max="10"
              step="0.1"
              .value=${this._transitionTime.toString()}
              @input=${t=>{this._transitionTime=parseFloat(t.target.value),this.requestUpdate()}}
              @change=${()=>{this._editMode||this._saveConfiguration()}}
            />
            <div class="transition-marks">
              <span>0s</span>
              <span>5s</span>
              <span>10s</span>
            </div>
          </div>
        </div>
      </div>
    `}_renderTestActions(){return B`
      <div class="section">
        <h2 class="section-title">
          <ha-icon icon="mdi:test-tube"></ha-icon>
          Test e Diagnostica
        </h2>
        <div class="card">
          <div class="test-actions">
            <button class="button" @click=${this._testSync}>
              <ha-icon icon="mdi:sync"></ha-icon>
              Test Sincronizzazione
            </button>
            <div class="test-description">
              Sincronizza immediatamente tutte le luci slave accese con il master light
            </div>
          </div>
        </div>
      </div>
    `}render(){return B`
      <div class="lights-tab">
        <div class="grid grid-2">
          <div>
            ${this._renderMasterLightInfo()}
            ${this._renderBehaviorSettings()}
            ${this._renderTransitionSettings()}
          </div>
          <div>
            ${this._renderSlaveConfiguration()}
            ${this._editMode?"":this._renderTestActions()}
          </div>
        </div>
      </div>
    `}};kt.styles=[vt,r`
      .lights-tab {
        max-width: 1400px;
        margin: 0 auto;
      }

      .info-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 0;
      }

      .info-label {
        font-weight: 500;
        color: var(--secondary-text-color);
      }

      .info-value {
        color: var(--primary-text-color);
      }

      .slaves-list {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .lights-selector {
        display: flex;
        flex-direction: column;
        gap: 8px;
        max-height: 500px;
        overflow-y: auto;
        padding: 8px;
        background: var(--secondary-background-color);
        border-radius: 8px;
      }

      .selectable-light {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px;
        background: var(--card-background-color);
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.2s ease;
        border: 2px solid transparent;
      }

      .selectable-light:hover {
        transform: translateX(4px);
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      }

      .selectable-light.selected {
        border-color: var(--primary-color);
        background: var(--primary-color);
        color: white;
      }

      .selectable-light.selected .list-item-title,
      .selectable-light.selected .list-item-subtitle {
        color: white;
      }

      .checkbox {
        color: var(--primary-color);
      }

      .selectable-light.selected .checkbox {
        color: white;
      }

      .selection-info {
        text-align: center;
        padding: 12px;
        background: var(--primary-color);
        color: white;
        border-radius: 8px;
        font-weight: 500;
      }

      .setting-title {
        font-weight: 500;
        color: var(--primary-text-color);
        margin-bottom: 4px;
      }

      .setting-description {
        font-size: 12px;
        color: var(--secondary-text-color);
      }

      .transition-control {
        padding: 16px;
      }

      .transition-info {
        text-align: center;
        margin-bottom: 16px;
      }

      .transition-value {
        font-size: 32px;
        font-weight: 600;
        color: var(--primary-color);
      }

      .transition-label {
        font-size: 14px;
        color: var(--secondary-text-color);
      }

      .transition-control input[type="range"] {
        width: 100%;
        height: 4px;
        background: var(--divider-color);
        border-radius: 2px;
        outline: none;
        -webkit-appearance: none;
      }

      .transition-control input[type="range"]::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: var(--primary-color);
        cursor: pointer;
      }

      .transition-marks {
        display: flex;
        justify-content: space-between;
        margin-top: 8px;
        font-size: 12px;
        color: var(--secondary-text-color);
      }

      .test-actions {
        display: flex;
        flex-direction: column;
        gap: 12px;
        align-items: center;
      }

      .test-description {
        font-size: 12px;
        color: var(--secondary-text-color);
        text-align: center;
      }

      @media (max-width: 768px) {
        .lights-selector {
          max-height: 400px;
        }
      }
    `],t([ht({attribute:!1})],kt.prototype,"hass",void 0),t([ht({attribute:!1})],kt.prototype,"status",void 0),t([ht({attribute:!1})],kt.prototype,"config",void 0),t([ht({type:String})],kt.prototype,"entryId",void 0),t([pt()],kt.prototype,"_editMode",void 0),t([pt()],kt.prototype,"_selectedSlaves",void 0),t([pt()],kt.prototype,"_transitionTime",void 0),t([pt()],kt.prototype,"_syncOnEnable",void 0),t([pt()],kt.prototype,"_saving",void 0),kt=t([ct("lights-tab")],kt);let St=class extends rt{constructor(){super(...arguments),this._viewMode="list"}_parseScheduleTime(t,e){const i=e?t.from_type:t.to_type,s=e?t.from_time:t.to_time,o=e?t.from_offset:t.to_offset;if("time"===i&&s){const[t,e]=s.split(":").map(Number);return 60*t+e}return"sunrise"===i?420+o:"sunset"===i?1140+o:null}_renderViewToggle(){return B`
      <div class="view-toggle">
        <button
          class="view-button ${"list"===this._viewMode?"active":""}"
          @click=${()=>this._viewMode="list"}
        >
          <ha-icon icon="mdi:format-list-bulleted"></ha-icon>
          Lista
        </button>
        <button
          class="view-button ${"timeline"===this._viewMode?"active":""}"
          @click=${()=>this._viewMode="timeline"}
        >
          <ha-icon icon="mdi:timeline"></ha-icon>
          Timeline 24h
        </button>
        <button
          class="view-button ${"calendar"===this._viewMode?"active":""}"
          @click=${()=>this._viewMode="calendar"}
        >
          <ha-icon icon="mdi:calendar-week"></ha-icon>
          Calendario
        </button>
      </div>
    `}_renderSchedulesList(){const t=this.config.schedules||[];return 0===t.length?B`
        <div class="empty-state">
          <ha-icon icon="mdi:clock-outline"></ha-icon>
          <h3>Nessuna Schedule</h3>
          <p>Crea la tua prima schedule dal menu Dispositivi & Servizi</p>
        </div>
      `:B`
      <div class="schedules-list">
        ${t.map((t,e)=>this._renderScheduleCard(t,e))}
      </div>
    `}_renderScheduleCard(t,e){const i=gt(t.rgb_color),s=yt(t.brightness);return B`
      <div class="schedule-card ${t.enabled?"":"disabled"}">
        <div class="schedule-header">
          <div class="color-preview" style="background: ${i}">
            <div class="brightness-overlay" style="opacity: ${1-s/100}"></div>
          </div>
          <div class="schedule-info">
            <div class="schedule-name">${t.name}</div>
            <div class="schedule-time-display">${ft(t)}</div>
          </div>
          <span class="badge ${t.enabled?"success":""}">${t.enabled?"Attiva":"Disattiva"}</span>
        </div>

        <div class="schedule-details">
          <div class="detail-grid">
            <div class="detail-item">
              <ha-icon icon="mdi:brightness-6"></ha-icon>
              <span>${s}%</span>
            </div>
            <div class="detail-item">
              <ha-icon icon="mdi:palette"></ha-icon>
              <span>RGB(${t.rgb_color.join(", ")})</span>
            </div>
          </div>

          <div class="weekdays">
            ${[0,1,2,3,4,5,6].map(e=>B`
              <div class="weekday-chip ${t.weekdays.includes(e)?"active":""}">
                ${mt(e,!0)}
              </div>
            `)}
          </div>
        </div>
      </div>
    `}_renderTimeline(){const t=(this.config.schedules||[]).filter(t=>t.enabled);return B`
      <div class="timeline-view">
        <div class="timeline-header">
          <h3>Timeline 24 Ore</h3>
          <p>Vista oraria delle schedule attive per oggi</p>
        </div>
        <div class="timeline-container">
          <div class="timeline-hours">
            ${Array.from({length:24},(t,e)=>B`
              <div class="hour-mark">
                <div class="hour-label">${e.toString().padStart(2,"0")}:00</div>
                <div class="hour-line"></div>
              </div>
            `)}
          </div>
          <div class="timeline-schedules">
            ${t.map(t=>this._renderTimelineSchedule(t))}
          </div>
        </div>
      </div>
    `}_renderTimelineSchedule(t){const e=this._parseScheduleTime(t,!0),i=this._parseScheduleTime(t,!1);if(null===e||null===i)return B``;const s=e/1440*100,o=(i-e)/1440*100,a=gt(t.rgb_color),r=yt(t.brightness);return B`
      <div
        class="timeline-bar"
        style="left: ${s}%; width: ${o}%; background: ${a}; opacity: ${r/100}"
        title="${t.name}: ${ft(t)}"
      >
        <div class="timeline-bar-label">${t.name}</div>
      </div>
    `}_renderCalendar(){const t=(this.config.schedules||[]).filter(t=>t.enabled);return B`
      <div class="calendar-view">
        <div class="calendar-header">
          <h3>Vista Settimanale</h3>
          <p>Schedule per giorno della settimana</p>
        </div>
        <div class="calendar-grid">
          ${[0,1,2,3,4,5,6].map(e=>{const i=t.filter(t=>t.weekdays.includes(e));return B`
              <div class="calendar-day">
                <div class="day-header">
                  <div class="day-name">${mt(e)}</div>
                  <div class="day-count">${i.length} schedule</div>
                </div>
                <div class="day-schedules">
                  ${0===i.length?B`
                    <div class="no-schedules">Nessuna schedule</div>
                  `:i.map(t=>{const e=gt(t.rgb_color),i=yt(t.brightness);return B`
                      <div class="calendar-schedule">
                        <div class="color-preview small" style="background: ${e}">
                          <div class="brightness-overlay" style="opacity: ${1-i/100}"></div>
                        </div>
                        <div class="calendar-schedule-info">
                          <div class="calendar-schedule-name">${t.name}</div>
                          <div class="calendar-schedule-time">${ft(t)}</div>
                        </div>
                      </div>
                    `})}
                </div>
              </div>
            `})}
        </div>
      </div>
    `}_renderNextSchedule(){if(!this.status.next_schedule)return B``;const t=this.status.next_schedule,e=gt(t.rgb_color),i=yt(t.brightness);return B`
      <div class="section">
        <div class="card next-schedule-card">
          <div class="next-schedule-header">
            <ha-icon icon="mdi:clock-check"></ha-icon>
            <div>
              <div class="next-schedule-label">Prossima Schedule</div>
              <div class="next-schedule-name">${t.name}</div>
            </div>
          </div>
          <div class="next-schedule-content">
            <div class="next-schedule-time">
              <ha-icon icon="mdi:calendar-clock"></ha-icon>
              ${new Date(t.trigger_time).toLocaleString("it-IT")}
            </div>
            <div class="next-schedule-preview">
              <div class="color-preview large" style="background: ${e}">
                <div class="brightness-overlay" style="opacity: ${1-i/100}"></div>
              </div>
              <div class="preview-details">
                <div class="preview-brightness">${i}%</div>
                <div class="preview-rgb">RGB(${t.rgb_color.join(", ")})</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `}render(){return B`
      <div class="schedules-tab">
        ${this._renderNextSchedule()}

        <div class="section">
          <div class="row space-between">
            <h2 class="section-title">
              <ha-icon icon="mdi:calendar-multiple"></ha-icon>
              Schedule (${this.config.schedules?.length||0})
            </h2>
            ${this._renderViewToggle()}
          </div>
        </div>

        <div class="section">
          ${"list"===this._viewMode?this._renderSchedulesList():""}
          ${"timeline"===this._viewMode?this._renderTimeline():""}
          ${"calendar"===this._viewMode?this._renderCalendar():""}
        </div>

        <div class="section">
          <div class="card info-card">
            <ha-icon icon="mdi:information"></ha-icon>
            <div>
              <div class="info-title">Gestione Schedule</div>
              <div class="info-text">
                Per creare, modificare o eliminare schedule, vai in <strong>Impostazioni → Dispositivi e Servizi → Light Sync Master</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    `}};St.styles=[vt,r`
      .schedules-tab {
        max-width: 1400px;
        margin: 0 auto;
      }

      .view-toggle {
        display: flex;
        gap: 4px;
        background: var(--secondary-background-color);
        padding: 4px;
        border-radius: 8px;
      }

      .view-button {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 8px 16px;
        background: transparent;
        border: none;
        border-radius: 6px;
        color: var(--secondary-text-color);
        cursor: pointer;
        font-size: 14px;
        font-weight: 500;
        transition: all 0.2s ease;
      }

      .view-button:hover {
        background: var(--divider-color);
        color: var(--primary-text-color);
      }

      .view-button.active {
        background: var(--primary-color);
        color: white;
      }

      .schedules-list {
        display: grid;
        gap: 16px;
      }

      .schedule-card {
        background: var(--card-background-color);
        border-radius: 12px;
        padding: 16px;
        border: 2px solid var(--divider-color);
        transition: all 0.2s ease;
      }

      .schedule-card:hover {
        border-color: var(--primary-color);
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      }

      .schedule-card.disabled {
        opacity: 0.5;
      }

      .schedule-header {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 12px;
      }

      .schedule-info {
        flex: 1;
      }

      .schedule-name {
        font-size: 16px;
        font-weight: 500;
        color: var(--primary-text-color);
      }

      .schedule-time-display {
        font-size: 14px;
        color: var(--secondary-text-color);
        margin-top: 2px;
      }

      .schedule-details {
        display: flex;
        flex-direction: column;
        gap: 12px;
        padding-left: 44px;
      }

      .detail-grid {
        display: flex;
        gap: 16px;
        flex-wrap: wrap;
      }

      .weekdays {
        display: flex;
        gap: 6px;
        flex-wrap: wrap;
      }

      .weekday-chip {
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 11px;
        font-weight: 600;
        background: var(--secondary-background-color);
        color: var(--secondary-text-color);
      }

      .weekday-chip.active {
        background: var(--primary-color);
        color: white;
      }

      /* Timeline View */
      .timeline-view {
        background: var(--card-background-color);
        border-radius: 12px;
        padding: 20px;
      }

      .timeline-header {
        margin-bottom: 24px;
      }

      .timeline-header h3 {
        margin: 0 0 4px 0;
        font-size: 18px;
        color: var(--primary-text-color);
      }

      .timeline-header p {
        margin: 0;
        font-size: 14px;
        color: var(--secondary-text-color);
      }

      .timeline-container {
        position: relative;
        height: 200px;
      }

      .timeline-hours {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 40px;
        display: flex;
      }

      .hour-mark {
        flex: 1;
        position: relative;
      }

      .hour-label {
        font-size: 10px;
        color: var(--secondary-text-color);
        position: absolute;
        top: 0;
        left: 0;
        transform: translateX(-50%);
      }

      .hour-line {
        position: absolute;
        top: 20px;
        left: 0;
        width: 1px;
        height: 180px;
        background: var(--divider-color);
      }

      .timeline-schedules {
        position: absolute;
        top: 50px;
        left: 0;
        right: 0;
        bottom: 0;
      }

      .timeline-bar {
        position: absolute;
        height: 40px;
        border-radius: 6px;
        display: flex;
        align-items: center;
        padding: 0 8px;
        color: white;
        font-size: 12px;
        font-weight: 500;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        cursor: pointer;
        transition: transform 0.2s ease;
      }

      .timeline-bar:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0,0,0,0.3);
      }

      .timeline-bar-label {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      /* Calendar View */
      .calendar-view {
        background: var(--card-background-color);
        border-radius: 12px;
        padding: 20px;
      }

      .calendar-header {
        margin-bottom: 24px;
      }

      .calendar-header h3 {
        margin: 0 0 4px 0;
        font-size: 18px;
        color: var(--primary-text-color);
      }

      .calendar-header p {
        margin: 0;
        font-size: 14px;
        color: var(--secondary-text-color);
      }

      .calendar-grid {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        gap: 12px;
      }

      .calendar-day {
        background: var(--secondary-background-color);
        border-radius: 8px;
        overflow: hidden;
      }

      .day-header {
        background: var(--primary-color);
        color: white;
        padding: 12px;
        text-align: center;
      }

      .day-name {
        font-weight: 600;
        font-size: 14px;
      }

      .day-count {
        font-size: 11px;
        opacity: 0.9;
        margin-top: 2px;
      }

      .day-schedules {
        padding: 8px;
        min-height: 100px;
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .no-schedules {
        color: var(--disabled-text-color);
        font-size: 12px;
        text-align: center;
        padding: 20px 0;
      }

      .calendar-schedule {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px;
        background: var(--card-background-color);
        border-radius: 6px;
      }

      .calendar-schedule-info {
        flex: 1;
        min-width: 0;
      }

      .calendar-schedule-name {
        font-size: 12px;
        font-weight: 500;
        color: var(--primary-text-color);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .calendar-schedule-time {
        font-size: 10px;
        color: var(--secondary-text-color);
      }

      /* Next Schedule Card */
      .next-schedule-card {
        background: linear-gradient(135deg, var(--primary-color) 0%, var(--accent-color) 100%);
        color: white;
      }

      .next-schedule-header {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 16px;
      }

      .next-schedule-header ha-icon {
        font-size: 32px;
      }

      .next-schedule-label {
        font-size: 12px;
        opacity: 0.9;
      }

      .next-schedule-name {
        font-size: 20px;
        font-weight: 600;
      }

      .next-schedule-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 16px;
      }

      .next-schedule-time {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 16px;
        font-weight: 500;
      }

      .next-schedule-preview {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .preview-details {
        text-align: right;
      }

      .preview-brightness {
        font-size: 18px;
        font-weight: 600;
      }

      .preview-rgb {
        font-size: 12px;
        opacity: 0.9;
      }

      /* Info Card */
      .info-card {
        display: flex;
        gap: 16px;
        background: var(--info-color, #2196f3);
        color: white;
      }

      .info-card ha-icon {
        font-size: 32px;
        flex-shrink: 0;
      }

      .info-title {
        font-size: 16px;
        font-weight: 600;
        margin-bottom: 4px;
      }

      .info-text {
        font-size: 14px;
        opacity: 0.95;
        line-height: 1.5;
      }

      @media (max-width: 1200px) {
        .calendar-grid {
          grid-template-columns: repeat(4, 1fr);
        }
      }

      @media (max-width: 768px) {
        .calendar-grid {
          grid-template-columns: repeat(2, 1fr);
        }

        .view-toggle {
          flex-wrap: wrap;
        }

        .timeline-container {
          overflow-x: auto;
        }
      }
    `],t([ht({attribute:!1})],St.prototype,"hass",void 0),t([ht({attribute:!1})],St.prototype,"status",void 0),t([ht({attribute:!1})],St.prototype,"config",void 0),t([ht({type:String})],St.prototype,"entryId",void 0),t([pt()],St.prototype,"_viewMode",void 0),St=t([ct("schedules-tab")],St);let At=class extends rt{constructor(){super(...arguments),this._logs=[],this._autoScroll=!0,this._filterType="all",this._testing=!1}connectedCallback(){super.connectedCallback(),this._loadLogs(),this._updateInterval=window.setInterval(()=>this._loadLogs(),2e3)}disconnectedCallback(){super.disconnectedCallback(),this._updateInterval&&clearInterval(this._updateInterval)}firstUpdated(){this._logsContainer=this.shadowRoot?.querySelector(".logs-content")}updated(){this._autoScroll&&this._logsContainer&&(this._logsContainer.scrollTop=this._logsContainer.scrollHeight)}async _loadLogs(){try{const t=await xt(this.hass,`/api/light_sync_master/${this.entryId}/logs`);this._logs=t}catch(t){console.error("Error loading logs:",t)}}async _clearLogs(){if(confirm("Vuoi davvero cancellare tutti i log?"))try{await _t(this.hass,`/api/light_sync_master/${this.entryId}/clear_logs`,{}),this._logs=[]}catch(t){console.error("Error clearing logs:",t),alert("Errore nella cancellazione dei log")}}async _testAllLights(){this._testing=!0;try{await _t(this.hass,`/api/light_sync_master/${this.entryId}/test_all_lights`,{}),alert("Test connettività avviato! Controlla i log per i risultati.")}catch(t){console.error("Error testing lights:",t),alert("Errore nel test delle luci")}finally{this._testing=!1}}async _exportConfig(){try{const t=await xt(this.hass,`/api/light_sync_master/${this.entryId}/export_config`),e=new Blob([JSON.stringify(t,null,2)],{type:"application/json"}),i=URL.createObjectURL(e),s=document.createElement("a");s.href=i,s.download=`light-sync-master-config-${this.config.name}.json`,s.click(),URL.revokeObjectURL(i)}catch(t){console.error("Error exporting config:",t),alert("Errore nell'esportazione della configurazione")}}_getFilteredLogs(){return"all"===this._filterType?this._logs:this._logs.filter(t=>t.type===this._filterType)}_getLogIcon(t){switch(t){case"sync":return"mdi:sync";case"schedule":return"mdi:clock-check";case"error":return"mdi:alert-circle";case"info":return"mdi:information";default:return"mdi:circle"}}_getLogClass(t){switch(t){case"sync":case"info":return"info";case"schedule":return"success";case"error":return"error";default:return""}}_renderLogStream(){const t=this._getFilteredLogs();return B`
      <div class="section">
        <div class="row space-between">
          <h2 class="section-title">
            <ha-icon icon="mdi:text-box-multiple"></ha-icon>
            Log Stream (${t.length})
          </h2>
          <div class="row" style="gap: 8px">
            <select
              .value=${this._filterType}
              @change=${t=>{this._filterType=t.target.value}}
              class="filter-select"
            >
              <option value="all">Tutti i log</option>
              <option value="sync">Sincronizzazioni</option>
              <option value="schedule">Schedule</option>
              <option value="error">Errori</option>
              <option value="info">Info</option>
            </select>
            <label class="auto-scroll-toggle">
              <input
                type="checkbox"
                .checked=${this._autoScroll}
                @change=${t=>{this._autoScroll=t.target.checked}}
              />
              Auto-scroll
            </label>
            <button class="icon-button" @click=${this._clearLogs} title="Cancella log">
              <ha-icon icon="mdi:delete"></ha-icon>
            </button>
          </div>
        </div>

        <div class="card logs-container">
          <div class="logs-content">
            ${0===t.length?B`
              <div class="empty-state">
                <ha-icon icon="mdi:text-box-remove"></ha-icon>
                <p>Nessun log disponibile</p>
              </div>
            `:t.map(t=>B`
              <div class="log-entry ${this._getLogClass(t.type)}">
                <div class="log-icon">
                  <ha-icon icon="${this._getLogIcon(t.type)}"></ha-icon>
                </div>
                <div class="log-content">
                  <div class="log-header">
                    <span class="log-time">${bt(t.timestamp)}</span>
                    <span class="badge ${this._getLogClass(t.type)}">${t.type.toUpperCase()}</span>
                  </div>
                  <div class="log-message">${t.message}</div>
                  ${t.entity_id?B`
                    <div class="log-entity">${t.entity_id}</div>
                  `:""}
                  ${t.details?B`
                    <details class="log-details">
                      <summary>Dettagli</summary>
                      <pre>${JSON.stringify(t.details,null,2)}</pre>
                    </details>
                  `:""}
                </div>
              </div>
            `)}
          </div>
        </div>
      </div>
    `}_renderSystemInfo(){return B`
      <div class="section">
        <h2 class="section-title">
          <ha-icon icon="mdi:information"></ha-icon>
          Informazioni Sistema
        </h2>
        <div class="card">
          <div class="info-grid">
            <div class="info-item">
              <div class="info-label">Entry ID</div>
              <div class="info-value">${this.entryId}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Nome Configurazione</div>
              <div class="info-value">${this.config.name}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Luci Totali</div>
              <div class="info-value">${this.config.slave_entities.length}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Schedule Attive</div>
              <div class="info-value">
                ${(this.config.schedules||[]).filter(t=>t.enabled).length} /
                ${(this.config.schedules||[]).length}
              </div>
            </div>
            <div class="info-item">
              <div class="info-label">Tempo Transizione</div>
              <div class="info-value">${this.config.transition_time}s</div>
            </div>
            <div class="info-item">
              <div class="info-label">Debug Logging</div>
              <div class="info-value">
                <span class="badge ${this.config.enable_debug_logging?"success":""}">
                  ${this.config.enable_debug_logging?"Attivo":"Disattivo"}
                </span>
              </div>
            </div>
            <div class="info-item">
              <div class="info-label">Sync Default</div>
              <div class="info-value">
                <span class="badge ${this.config.sync_enabled_default?"success":""}">
                  ${this.config.sync_enabled_default?"ON":"OFF"}
                </span>
              </div>
            </div>
            <div class="info-item">
              <div class="info-label">Sync on Enable</div>
              <div class="info-value">
                <span class="badge ${this.config.sync_on_enable?"success":""}">
                  ${this.config.sync_on_enable?"Sì":"No"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `}_renderTools(){return B`
      <div class="section">
        <h2 class="section-title">
          <ha-icon icon="mdi:tools"></ha-icon>
          Strumenti Diagnostica
        </h2>
        <div class="grid grid-2">
          <div class="card tool-card">
            <ha-icon icon="mdi:lightbulb-group"></ha-icon>
            <div class="tool-info">
              <div class="tool-title">Test Connettività Luci</div>
              <div class="tool-description">
                Verifica lo stato e la disponibilità di tutte le luci slave
              </div>
            </div>
            <button
              class="button"
              @click=${this._testAllLights}
              ?disabled=${this._testing}
            >
              ${this._testing?"Test in corso...":"Avvia Test"}
            </button>
          </div>

          <div class="card tool-card">
            <ha-icon icon="mdi:download"></ha-icon>
            <div class="tool-info">
              <div class="tool-title">Esporta Configurazione</div>
              <div class="tool-description">
                Scarica la configurazione completa in formato JSON
              </div>
            </div>
            <button class="button secondary" @click=${this._exportConfig}>
              Esporta
            </button>
          </div>
        </div>
      </div>
    `}_renderStatistics(){const t=this.status.statistics,e=t.uptime||"N/A";return B`
      <div class="section">
        <h2 class="section-title">
          <ha-icon icon="mdi:chart-box"></ha-icon>
          Statistiche Dettagliate
        </h2>
        <div class="grid grid-4">
          <div class="stat-card">
            <div class="stat-value">${t.total_syncs}</div>
            <div class="stat-label">Sincronizzazioni Totali</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${t.syncs_today}</div>
            <div class="stat-label">Sincronizzazioni Oggi</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${t.active_lights}</div>
            <div class="stat-label">Luci Attive</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${e}</div>
            <div class="stat-label">Uptime</div>
          </div>
        </div>
      </div>
    `}render(){return B`
      <div class="diagnostics-tab">
        ${this._renderStatistics()}
        ${this._renderSystemInfo()}
        ${this._renderTools()}
        ${this._renderLogStream()}
      </div>
    `}};At.styles=[vt,r`
      .diagnostics-tab {
        max-width: 1400px;
        margin: 0 auto;
      }

      .info-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 16px;
      }

      .info-item {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      .info-label {
        font-size: 12px;
        font-weight: 500;
        color: var(--secondary-text-color);
        text-transform: uppercase;
      }

      .info-value {
        font-size: 14px;
        color: var(--primary-text-color);
        font-weight: 500;
      }

      .tool-card {
        display: flex;
        flex-direction: column;
        gap: 12px;
        align-items: center;
        text-align: center;
      }

      .tool-card ha-icon {
        font-size: 48px;
        color: var(--primary-color);
      }

      .tool-info {
        flex: 1;
      }

      .tool-title {
        font-size: 16px;
        font-weight: 500;
        color: var(--primary-text-color);
        margin-bottom: 4px;
      }

      .tool-description {
        font-size: 12px;
        color: var(--secondary-text-color);
      }

      .filter-select {
        padding: 6px 12px;
        border: 1px solid var(--divider-color);
        border-radius: 6px;
        background: var(--card-background-color);
        color: var(--primary-text-color);
        font-size: 14px;
        cursor: pointer;
      }

      .auto-scroll-toggle {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 14px;
        color: var(--primary-text-color);
        cursor: pointer;
      }

      .logs-container {
        background: var(--secondary-background-color);
        padding: 0;
        max-height: 600px;
        overflow: hidden;
      }

      .logs-content {
        height: 600px;
        overflow-y: auto;
        padding: 16px;
      }

      .log-entry {
        display: flex;
        gap: 12px;
        padding: 12px;
        background: var(--card-background-color);
        border-radius: 8px;
        margin-bottom: 8px;
        border-left: 4px solid var(--divider-color);
      }

      .log-entry.info {
        border-left-color: #2196f3;
      }

      .log-entry.success {
        border-left-color: #4caf50;
      }

      .log-entry.error {
        border-left-color: #f44336;
      }

      .log-icon {
        flex-shrink: 0;
        width: 32px;
        height: 32px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--secondary-background-color);
      }

      .log-entry.info .log-icon {
        background: rgba(33, 150, 243, 0.2);
        color: #2196f3;
      }

      .log-entry.success .log-icon {
        background: rgba(76, 175, 80, 0.2);
        color: #4caf50;
      }

      .log-entry.error .log-icon {
        background: rgba(244, 67, 54, 0.2);
        color: #f44336;
      }

      .log-content {
        flex: 1;
        min-width: 0;
      }

      .log-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 4px;
        gap: 8px;
      }

      .log-time {
        font-size: 11px;
        color: var(--secondary-text-color);
      }

      .log-message {
        font-size: 14px;
        color: var(--primary-text-color);
        margin-bottom: 4px;
        word-wrap: break-word;
      }

      .log-entity {
        font-size: 12px;
        color: var(--secondary-text-color);
        font-family: monospace;
      }

      .log-details {
        margin-top: 8px;
        font-size: 12px;
      }

      .log-details summary {
        cursor: pointer;
        color: var(--primary-color);
        font-weight: 500;
      }

      .log-details pre {
        margin: 8px 0 0 0;
        padding: 8px;
        background: var(--secondary-background-color);
        border-radius: 4px;
        overflow-x: auto;
        font-size: 11px;
        color: var(--primary-text-color);
      }

      @media (max-width: 768px) {
        .info-grid {
          grid-template-columns: 1fr;
        }

        .logs-container,
        .logs-content {
          max-height: 400px;
          height: 400px;
        }
      }
    `],t([ht({attribute:!1})],At.prototype,"hass",void 0),t([ht({attribute:!1})],At.prototype,"status",void 0),t([ht({attribute:!1})],At.prototype,"config",void 0),t([ht({type:String})],At.prototype,"entryId",void 0),t([pt()],At.prototype,"_logs",void 0),t([pt()],At.prototype,"_autoScroll",void 0),t([pt()],At.prototype,"_filterType",void 0),t([pt()],At.prototype,"_testing",void 0),At=t([ct("diagnostics-tab")],At);let zt=class extends rt{constructor(){super(...arguments),this._activeTab="dashboard",this._loading=!0}connectedCallback(){super.connectedCallback(),this._loadData(),this._setupWebSocket(),this._updateInterval=window.setInterval(()=>this._loadData(),5e3)}disconnectedCallback(){super.disconnectedCallback(),this._wsUnsubscribe&&this._wsUnsubscribe(),this._updateInterval&&clearInterval(this._updateInterval)}updated(t){super.updated(t),t.has("hass")&&this.hass&&this._updateFromHass()}async _loadData(){try{this._loading=!0,this._error=void 0;const t=this.panel?.config?.entry_id;if(!t)throw new Error("No entry_id found in panel config");const[e,i]=await Promise.all([xt(this.hass,`/api/light_sync_master/${t}/status`),xt(this.hass,`/api/light_sync_master/${t}/config`)]);this._status=e,this._config=i,this._loading=!1}catch(t){console.error("Error loading Light Sync Master data:",t),this._error=t.message||"Failed to load data",this._loading=!1}}_setupWebSocket(){this.hass?.connection&&this.hass.connection.subscribeMessage(t=>this._handleWsMessage(t),{type:"light_sync_master/subscribe",entry_id:this.panel?.config?.entry_id}).then(t=>{this._wsUnsubscribe=t}).catch(t=>{console.warn("WebSocket subscription failed, using polling:",t)})}_handleWsMessage(t){"status_update"===t.type&&(this._status=t.data)}_updateFromHass(){if(!this._status||!this._config)return;const t=this.hass.states[this._status.master_light.entity_id],e=this.hass.states[this._status.sync_switch.entity_id];t&&(this._status={...this._status,master_light:{entity_id:t.entity_id,state:t.state,brightness:t.attributes.brightness||255,rgb_color:t.attributes.rgb_color,hs_color:t.attributes.hs_color,xy_color:t.attributes.xy_color,color_temp:t.attributes.color_temp}}),e&&(this._status={...this._status,sync_switch:{entity_id:e.entity_id,state:"on"===e.state}})}_handleTabClick(t){this._activeTab=t}_renderTabs(){return B`
      <div class="tabs">
        <button
          class="tab ${"dashboard"===this._activeTab?"active":""}"
          @click=${()=>this._handleTabClick("dashboard")}
        >
          <ha-icon icon="mdi:view-dashboard"></ha-icon>
          <span>Dashboard</span>
        </button>
        <button
          class="tab ${"lights"===this._activeTab?"active":""}"
          @click=${()=>this._handleTabClick("lights")}
        >
          <ha-icon icon="mdi:lightbulb-group"></ha-icon>
          <span>Luci</span>
        </button>
        <button
          class="tab ${"schedules"===this._activeTab?"active":""}"
          @click=${()=>this._handleTabClick("schedules")}
        >
          <ha-icon icon="mdi:clock-outline"></ha-icon>
          <span>Schedule</span>
        </button>
        <button
          class="tab ${"diagnostics"===this._activeTab?"active":""}"
          @click=${()=>this._handleTabClick("diagnostics")}
        >
          <ha-icon icon="mdi:stethoscope"></ha-icon>
          <span>Diagnostica</span>
        </button>
      </div>
    `}_renderContent(){if(this._loading)return B`
        <div class="loading">
          <div class="spinner"></div>
        </div>
      `;if(this._error)return B`
        <div class="empty-state">
          <ha-icon icon="mdi:alert-circle"></ha-icon>
          <h2>Errore</h2>
          <p>${this._error}</p>
          <button class="button" @click=${this._loadData}>Riprova</button>
        </div>
      `;if(!this._status||!this._config)return B`
        <div class="empty-state">
          <ha-icon icon="mdi:information"></ha-icon>
          <p>Nessun dato disponibile</p>
        </div>
      `;const t=this.panel?.config?.entry_id;switch(this._activeTab){case"dashboard":return B`
          <dashboard-tab
            .hass=${this.hass}
            .status=${this._status}
            .config=${this._config}
            .entryId=${t}
          ></dashboard-tab>
        `;case"lights":return B`
          <lights-tab
            .hass=${this.hass}
            .status=${this._status}
            .config=${this._config}
            .entryId=${t}
            @config-changed=${this._loadData}
          ></lights-tab>
        `;case"schedules":return B`
          <schedules-tab
            .hass=${this.hass}
            .status=${this._status}
            .config=${this._config}
            .entryId=${t}
            @config-changed=${this._loadData}
          ></schedules-tab>
        `;case"diagnostics":return B`
          <diagnostics-tab
            .hass=${this.hass}
            .status=${this._status}
            .config=${this._config}
            .entryId=${t}
          ></diagnostics-tab>
        `;default:return B``}}render(){return B`
      <div class="panel">
        <div class="header">
          <h1>
            <ha-icon icon="mdi:lightbulb-group"></ha-icon>
            Light Sync Master
          </h1>
          ${this._config?B`<span class="config-name">${this._config.name}</span>`:""}
        </div>
        ${this._renderTabs()}
        <div class="content">
          ${this._renderContent()}
        </div>
      </div>
    `}};zt.styles=[vt,r`
      :host {
        display: block;
        height: 100%;
        background: var(--primary-background-color);
      }

      .panel {
        height: 100%;
        display: flex;
        flex-direction: column;
      }

      .header {
        background: var(--card-background-color);
        padding: 16px 24px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        display: flex;
        align-items: center;
        gap: 16px;
      }

      .header h1 {
        margin: 0;
        font-size: 24px;
        font-weight: 500;
        display: flex;
        align-items: center;
        gap: 12px;
        color: var(--primary-text-color);
      }

      .header h1 ha-icon {
        color: var(--primary-color);
      }

      .config-name {
        font-size: 14px;
        color: var(--secondary-text-color);
        padding: 4px 12px;
        background: var(--secondary-background-color);
        border-radius: 16px;
      }

      .tabs {
        display: flex;
        background: var(--card-background-color);
        border-bottom: 1px solid var(--divider-color);
        padding: 0 24px;
        gap: 8px;
      }

      .tab {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 12px 20px;
        background: none;
        border: none;
        border-bottom: 2px solid transparent;
        color: var(--secondary-text-color);
        cursor: pointer;
        font-size: 14px;
        font-weight: 500;
        transition: all 0.2s ease;
      }

      .tab:hover {
        color: var(--primary-text-color);
        background: var(--secondary-background-color);
      }

      .tab.active {
        color: var(--primary-color);
        border-bottom-color: var(--primary-color);
      }

      .tab ha-icon {
        font-size: 20px;
      }

      .content {
        flex: 1;
        overflow-y: auto;
        padding: 24px;
      }

      @media (max-width: 768px) {
        .header {
          padding: 12px 16px;
        }

        .header h1 {
          font-size: 20px;
        }

        .tabs {
          padding: 0 8px;
          overflow-x: auto;
        }

        .tab {
          padding: 12px 16px;
          font-size: 13px;
        }

        .tab span {
          display: none;
        }

        .content {
          padding: 16px;
        }
      }
    `],t([ht({attribute:!1})],zt.prototype,"hass",void 0),t([ht({type:String})],zt.prototype,"panel",void 0),t([pt()],zt.prototype,"_activeTab",void 0),t([pt()],zt.prototype,"_status",void 0),t([pt()],zt.prototype,"_config",void 0),t([pt()],zt.prototype,"_loading",void 0),t([pt()],zt.prototype,"_error",void 0),zt=t([ct("light-sync-panel")],zt),window.customPanels=window.customPanels||[],window.customPanels.push({name:"light-sync-panel",path:"light-sync",title:"Light Sync Master",icon:"mdi:lightbulb-group",component:"light-sync-panel"});export{zt as LightSyncPanel};
