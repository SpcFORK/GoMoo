(()=>{var g=(n,t)=>()=>(t||n((t={exports:{}}).exports,t),t.exports);var ne=g((dn,_)=>{function*Le(n){let t="",e=i=0,r=1,o=!1,d=(s,u)=>{s===u?r++:l(s)},l=s=>{r>1?a(s):f(s),c()},a=s=>{o||(t+="[",o=!0),e!=r&&(t+=r,e=r),t+=s},f=s=>{o&&(t+="]",o=!1),t+=s},c=()=>{i==n.length-1&&o&&(t+="]"),r=1};try{for(;i<n.length;i++)d(n[i],n[i+1]),yield t,t=""}catch(s){console.error("Failed to encode COWRLE:",s)}finally{t=null}}function*He(n){let t="",e="",r=!1,o=1,d=0,l=c=>{if(c==="["){r=!0;return}if(c==="]"){r=!1;return}c!==" "&&!isNaN(c)?a(c):f(c)},a=c=>{e+=c,o=parseInt(e)},f=c=>{parseInt(e)!==0&&parseInt(e)!==o?t+=c.repeat(o):parseInt(e)==o?(t+=c.repeat(parseInt(e)),e="0"):r?t+=c.repeat(parseInt(e)||o):t+=c};try{for(;d<n.length;d++)l(n[d]),yield t,t=""}catch(c){console.error("Failed to decode COWRLE:",c)}finally{t=null}}function De(n){return[...Le(n)].join("")}function Ie(n){return[...He(n)].join("")}var ee={encodeCOWRLE:De,decodeCOWRLE:Ie};typeof globalThis.window<"u"&&(globalThis.window.cowrle=ee);typeof _<"u"&&(_.exports=ee)});var oe=g((cn,A)=>{function Me(n){let t=[];for(let o=0;o<n.length;o++){let d=n.slice(o)+n.slice(0,o);t.push(d)}t.sort();let e="";for(let o=0;o<t.length;o++)e+=t[o][n.length-1];let r;for(let o=0;o<t.length;o++)if(t[o]===n){r=o;break}return{transformedString:e,originalIndex:r}}function _e(n="",t){let e=[];for(let d=0;d<n.length;d++)e.push({char:n[d],index:d});e.sort((d,l)=>d.char<l.char?-1:d.char>l.char?1:0);let r="",o=t;for(let d=0;d<n.length;d++)r+=e[o].char,o=e[o].index;return r}var te={burrowsWheelerTransform:Me,inverseBurrowsWheelerTransform:_e};typeof globalThis.window<"u"&&(globalThis.window.bwt=te);typeof A<"u"&&(A.exports=te)});var R=g((ln,O)=>{var re={chars:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",encode(n=""){let t=this.chars,e="",r=0;for(;r<n.length;){let o=n.charCodeAt(r++),d=n.charCodeAt(r++),l=n.charCodeAt(r++),a=o>>2,f=(o&3)<<4|d>>4,c=isNaN(d)?64:(d&15)<<2|l>>6,s=isNaN(l)?64:l&63;e+=[a,f,c,s].map(u=>t[u]).join("")}return e=e.replace(/=+$/,""),e},decode(n=""){let t=this.chars,e="",r=0;for(n=n.replace(/[^A-Za-z0-9\+\/\=]/g,"");r<n.length;){let o=t.indexOf(n.charAt(r++)),d=t.indexOf(n.charAt(r++)),l=t.indexOf(n.charAt(r++)),a=t.indexOf(n.charAt(r++)),f=o<<2|d>>4,c=(d&15)<<4|l>>2,s=(l&3)<<6|a;e+=String.fromCharCode(f),l!==64&&(e+=String.fromCharCode(c)),a!==64&&(e+=String.fromCharCode(s))}return e=e.replace(/[\x00\uffff]+$/g,""),e}};typeof globalThis.window<"u"&&(globalThis.window.base64=re);typeof globalThis.Buffer<"u"?O.exports={encode(n){return globalThis.Buffer.from(n).toString("base64")},decode(n){return globalThis.Buffer.from(n,"base64").toString("ascii")}}:typeof O<"u"&&(O.exports=re)});var ae=g((an,P)=>{var sn=R(),L=class{constructor(t,e){this.char=t,this.freq=e,this.left=null,this.right=null}};function de(n){let t={};for(let e=0;e<n.length;e++)t.hasOwnProperty(n[e])?t[n[e]]++:t[n[e]]=1;return t}function ce(n){let t=[];for(let e in n)t.push(new L(e,n[e]));for(;t.length>1;){t.sort((d,l)=>d.freq-l.freq);let e=t.shift(),r=t.shift(),o=new L(null,e.freq+r.freq);o.left=e,o.right=r,t.push(o)}return t[0]}function H(n,t="",e={}){return n.char!==null?e[n.char]=t:(H(n.left,t+"0",e),H(n.right,t+"1",e)),e}function le(n,t){let e="";for(let r=0;r<n.length;r++)e+=t[n[r]];return e}function Ae(n){let t=de(n),e=ce(t),r=H(e);return{encoded:le(n,r),codeMap:r}}function Re(n,t){let e="",r="";for(let o=0;o<n.length;o++){r+=n[o];for(let d in t)if(t[d]===r){e+=d,r="";break}}return e}var q=["\0","","","","","",""],ie="L&"+q.join("&"),D=[ie+q[0],ie+q[1]];function qe(n={}){let t="";for(let e in n)t+=`${e}${D[0]}${n[e]}${D[1]}`;return t}function Pe(n){let t={};for(let e of n.split(D[1])){let[r,o]=e.split(D[0]);t[r]=o}return t}var se={buildFrequencyMap:de,buildHuffmanTree:ce,buildCodeMap:H,encode:le,compress:Ae,decompress:Re,codeMapToString:qe,unpackCodeMapString:Pe};typeof globalThis.window<"u"&&(globalThis.window.huffman=se);typeof P<"u"&&(P.exports=se)});var ge=g((fn,W)=>{var fe=.032958984375;function We(n){return n.length*fe}function je(n){return Math.ceil(n.length/8192)}var ue={CHUNK_LENGTH:8192,CHUCK_LENGTH_SPEED:270,CHAR_EXCHANGE_COST:fe,calculateCost:We,calculateChunks:je};typeof globalThis.window<"u"&&(globalThis.window.cst=ue);typeof W<"u"&&(W.exports=ue)});var pe=g((un,j)=>{var he={caseChunk({transformedString:n,originalIndex:t}){return`<Bull_Chunk:${n}|${t}:>`},caseBull({chunk:n}){return`<Bull:${n}:>`},caseChunk2({transformedString:n,originalIndex:t,map:e,mapI:r}){return`<Bull2_Chunk:${n}|${t}|${e}|${r}:>`},caseBull2({chunk:n}){return`<Bull2:${n}:>`}};typeof globalThis.window<"u"&&(globalThis.window.casing=he);typeof j<"u"&&(j.exports=he)});var Ce=g((gn,F)=>{var me={encode(n){let t=e=>`(${e})`;return n.replace(/\d+/g,e=>t(e.split("").map(r=>String.fromCharCode(65+parseInt(r))).join("")))},decode(n){return n.replace(/\((.*?)\)/g,(t,e)=>e.split("").map(r=>r.charCodeAt(0)-65).join(""))}};typeof globalThis.window<"u"&&(globalThis.window.AvoidEnc=me);typeof F<"u"&&(F.exports=me)});var we=g((hn,K)=>{var be={encode(n){return n.replace(/\]\(/g,"\u03E2").replace(/\)\[/g,"\u03E3").replace(/\]\{/g,"\u03E0").replace(/\}\[/g,"\u03E1").replace(/\)\{/g,"\u03DE").replace(/\}\(/g,"\u03DF").replace(/\(\[/g,"{").replace(/\]\)/g,"}").replace(/\[\(/g,"<").replace(/\)\]/g,">")},decode(n){return n.replace(/Ϣ/g,"](").replace(/ϣ/g,")[").replace(/Ϡ/g,"]{").replace(/ϡ/g,"}[").replace(/Ϟ/g,"){").replace(/ϟ/g,"}(").replace(/\{/g,"([").replace(/\}/g,"])").replace(/\</g,"[(").replace(/\>/g,")]")}};typeof globalThis.window<"u"&&(globalThis.window.BracketEncoder=be);typeof K<"u"&&(K.exports=be)});var Ee=g((pn,G)=>{var Te={isPattern:/(([^]+?)\2+)/g,reg:/(([^]+?)\2+)|([^])/g,unreg:/ͼ(([^]+?)(\d)+)+?ͼ/g,encode(n){return n.length===0?n:n.replace(this.isPattern,(t,e,r)=>{let o=e.split(r).length-1;return`\u037C${r+o}\u037C`})},decode(n){return n.replace(this.unreg,(t,e,r,o)=>r.repeat(parseInt(o)))}};typeof globalThis.window<"u"&&(globalThis.window.BracketEncoder=Te);typeof G<"u"&&(G.exports=Te)});var xe=g((Cn,z)=>{var E=ne(),S=oe(),y=ae(),{CHUNK_LENGTH:Se,CHUCK_LENGTH_SPEED:Fe,CHAR_EXCHANGE_COST:Ke,calculateCost:Ge,calculateChunks:$e}=ge(),$=pe(),x=Ce(),I=we(),mn=Ee(),k=R();function ze(n,t=Se*1){let e="";for(let r=0;r<n.length;r+=t){let o=n.substring(r,Math.min(r+t,n.length)),d=y.compress(o),l=k.encode(d.encoded),a=S.burrowsWheelerTransform(l),f=x.encode(a.transformedString),c=E.encodeCOWRLE(f),s=I.encode(c),u=y.codeMapToString(d.codeMap),b=k.encode(u),h=S.burrowsWheelerTransform(b),p=x.encode(h.transformedString),m=E.encodeCOWRLE(p),w=I.encode(m);e+=$.caseChunk2({transformedString:s,originalIndex:a.originalIndex,map:w,mapI:h.originalIndex})}return $.caseBull2({chunk:e})}function Ue(n){let t="",e=/<Bull2:(.*):>/g.exec(n)[1],r=e.match(/<Bull2_Chunk:(.*?)\|(\d+)\|(.*?)\|(\d+):>/g);if(r){for(let o=0;o<r.length;o++){let d=r[o],[,l,a,f,c]=d.match(/<Bull2_Chunk:(.*)\|(\d+)\|(.*)\|(\d+):>/),s=I.decode(f),u=E.decodeCOWRLE(s),b=x.decode(u),h=S.inverseBurrowsWheelerTransform(b,c),p=k.decode(h),m=y.unpackCodeMapString(p),w=I.decode(l),M=E.decodeCOWRLE(w),B=x.decode(M),C=S.inverseBurrowsWheelerTransform(B,a),T=k.decode(C),N=y.decompress(T,m);t+=N}return t}}var ye={encodeBullpress:ze,decodeBullpress:Ue,calculateCost:Ge,calculateChunks:$e,CHUNK_LENGTH:Se,CHUCK_LENGTH_SPEED:Fe,CHAR_EXCHANGE_COST:Ke,casing:$,AvoidEnc:x,base64:k,Cowrle:E,BWT:S,Huffman:y};typeof globalThis.window<"u"&&(globalThis.window.bullpress=ye);typeof z<"u"&&(z.exports=ye)});var tn=g((bn,v)=>{var{encodeBullpress:ve,decodeBullpress:Xe,CHUNK_LENGTH:ke,base64:Ze,Cowrle:Je,BWT:Qe,Huffman:Ve,calculateCost:U,calculateChunks:X}=xe();function Z(n,t=!1){let e=Date.now(),r=n;function o(...s){t&&console.log(...s)}o("Encode COST:    ",U(r)),n.length<1e3&&(o("Original String:   ",n),o("."),o("Original String (With URI ENCODE):   ",r),o(".."),o());let d=ve(r),l=d.length<r.length,a=X(r);o("Encoded String:   ",d<1e3?d:d.slice(0,1e3)+"...",`
`),o("Optimization Status:   ",l?"Optimized":"Not Optimized",`
`),o("Encoded Length:   ",d.length,"bytes (",(d.length/1024/1024).toFixed(2),"MB )"),o("Chunk Count:   ",a);let f=Date.now(),c=f-e;return o("Processing Time:   ",c,`ms
`),{uriString:r,encodedString:d,isOptimized:l,endTime:f,startTime:e,timeSpent:c,chunkCount:a,presumedTime:U(r).toFixed(2)}}function Ye(n,t=!1){return new Promise((e,r)=>e(Z(n,t)))}function J(n,t=!1){function e(...f){t&&console.log(...f)}let r=Date.now(),o=Xe(n),d=X(o);e("Decoded String:   ",o<1e3?o:o.slice(0,1e3)+"...",`
`),e("Decoded Length:   ",o.length,"bytes (",(o.length/1024/1024).toFixed(2),"MB )"),e("Chunk Count:   ",d);let l=Date.now(),a=l-r;return e("Processing Time:   ",a,`ms
`),{decodedString:o,endTime:l,startTime:r,timeSpent:a,chunkCount:d}}function en(n,t=!1){return new Promise((e,r)=>e(J(n,t)))}function nn(n,t=!1){function e(...Oe){t&&console.log(...Oe)}e(`.-- Encoding... --.
`);let r=Z(n,t),{uriString:o,isOptimized:d,encodedString:l,endTime:a,startTime:f,timeSpent:c,chunkCount:s,presumedTime:u}=r;e(`'---- Encoded ----'
`),e(`.-- Decoding... --.
`);let b=J(l,t),{decodedString:h,endTime:p,startTime:m,timeSpent:w,chunkCount:M}=b;e(`'---- Decoded ----'
`),e(`.-- Doing Math... --.
`);let B=p-f-u,C=l.length,T=o.length,N=h.length,on=C-T,Ne=(N-C)/C*100,Q=N-C,V=((C-T)/T*100).toFixed(2),Y=o===h;return e(`'-------------------'
`),e(`.-- Doing Logs... --.
`),e("Original Length:   ",o.length,"bytes (",(o.length/1024/1024).toFixed(2),"MB )"),e(),e("Chunk Length:   ",ke,"bytes"),e("Number of Chunks (Encoding):   ",s),e("Number of Chunks (Decoding):   ",M),e(),e("Encoding time:   ",c,"ms"),e("Decoding time:   ",p-m,"ms"),e("Presumed time:   ",u,"ms"),e(),e("Sizing difference:   ",Q,"bytes"),e("Size difference %:   ",V,"%"),e(),e("Encoding Optimization:   ",d?"Optimized":"Not Optimized"),e(),e("PDIFF:   ",Ne,"%"),e(),e("Total Processing Time:   ",a-f+p-m,"ms"),e(),e("Presumption Accuracy:   ",B.toFixed(2),"ms"),e(),e("Result:   ",Y?"Success":"Failure"),e(),e(`'-- Done logging! --'
`),{decodedString:()=>h,decodeEndTime:p,decodeStartTime:m,decodeTimeSpent:w,encodedString:()=>l,encodeEndTime:a,encodeStartTime:f,encodeTimeSpent:c,isOptimized:d,presumedTime:u,result:Y,sizeDifference:Q,sizeDifferencePerc:V,timeDifference:B,uriString:()=>o}}var Be={encode:Z,encodeP:Ye,decode:J,decodeP:en,Test:nn,CHUNK_LENGTH:ke,calculateCost:U,calculateChunks:X,base64:Ze,Cowrle:Je,BWT:Qe,Huffman:Ve};typeof globalThis.window<"u"&&(globalThis.window.GoMooE1=Be);typeof v<"u"&&(v.exports=Be)});tn();})();
//# sourceMappingURL=index.js.map
