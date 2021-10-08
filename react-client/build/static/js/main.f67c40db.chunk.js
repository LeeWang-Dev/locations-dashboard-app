(this["webpackJsonprocations-dashboard-app"]=this["webpackJsonprocations-dashboard-app"]||[]).push([[0],{116:function(t,e,n){"use strict";n.r(e);var r=n(0),c=n.n(r),o=n(57),a=n.n(o),i=(n(73),n(134)),s=n(137),u=n(133),l=n(17),d=n.n(l),p=n(28),b=n(21),f=n(5),j=n(18),h=(n(94),n(27)),m=n.n(h),O=n(60),g=n.n(O),x=function(){var t=Object(p.a)(d.a.mark((function t(e){var n,r;return d.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return n=null,r="".concat("https://locations-dashboard-herokuapp.com","/api/clusters"),t.next=4,g.a.get(r,{params:e||{}}).then((function(t){n=t.data})).catch((function(t){n={status:"failed",message:"No internet connection"}}));case 4:return t.abrupt("return",n);case 5:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}(),y=n(4);m.a.workerClass=n(113).default;var v=Object(u.a)({mapContainer:{"& .mapboxgl-ctrl-logo":{display:"none"}}});var w=function(){var t=v(),e=Object(r.useRef)(null),n=Object(r.useState)({longitude:0,latitude:0,zoom:1}),c=Object(f.a)(n,2),o=c[0],a=c[1],i=Object(r.useState)({type:"FeatureCollection",features:[]}),s=Object(f.a)(i,2),u=s[0],l=s[1];return Object(r.useEffect)((function(){var t=e.current.getMap();t.on("idle",Object(p.a)(d.a.mark((function e(){var n;return d.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,x({zoom:t.getZoom(),bounds:t.getBounds().toArray().flat()});case 2:"success"===(n=e.sent).status&&l(n.result);case 4:case"end":return e.stop()}}),e)}))))}),[]),Object(y.jsx)(j.c,Object(b.a)(Object(b.a)({className:t.mapContainer},o),{},{width:"100%",height:"100%",mapStyle:"mapbox://styles/mapbox/satellite-v9",mapboxApiAccessToken:"pk.eyJ1IjoibGVld2FuZ2RldiIsImEiOiJja2tnbDU2c2gwMHNvMndsdDF1d2pxNTQ2In0.zKeo06DtCh6fLifrbCZCFA",ref:e,attributionControl:!1,maxZoom:24,maxPitch:0,onViewportChange:function(t){a(t)},interactiveLayerIds:["cluster-layer","unclustered-point-layer"],onClick:function(t){if(t.features&&t.features.length>0){var e=t.features[0];"cluster-layer"===e.layer.id&&a(Object(b.a)(Object(b.a)({},o),{},{longitude:e.geometry.coordinates[0],latitude:e.geometry.coordinates[1],zoom:o.zoom+1,transitionDuration:500}))}},children:Object(y.jsxs)(j.b,{id:"clusterSource",type:"geojson",data:u,children:[Object(y.jsx)(j.a,{id:"cluster-layer",type:"circle",source:"clusterSource",filter:[">","point_count",1],paint:{"circle-color":["step",["get","point_count"],"#51bbd6",100,"#f1f075",750,"#f28cb1"],"circle-radius":["step",["get","point_count"],20,100,30,750,40]}}),Object(y.jsx)(j.a,{id:"cluster-count-layer",type:"symbol",source:"clusterSource",filter:[">","point_count",1],layout:{"text-field":"{point_count}","text-font":["DIN Offc Pro Medium","Arial Unicode MS Bold"],"text-size":12}}),Object(y.jsx)(j.a,{id:"unclustered-point-layer",type:"circle",source:"clusterSource",filter:["==","point_count",1],paint:{"circle-color":"#11b4da","circle-radius":4,"circle-stroke-width":1,"circle-stroke-color":"#fff"}})]})}))},C=Object(u.a)({root:{width:"100vw",height:"100vh"}});var k=function(){var t=C();return Object(y.jsx)("div",{className:t.root,children:Object(y.jsx)(w,{})})},S=Object(i.a)();var F=function(){return Object(y.jsx)(s.a,{theme:S,children:Object(y.jsx)(k,{})})},I=function(t){t&&t instanceof Function&&n.e(3).then(n.bind(null,138)).then((function(e){var n=e.getCLS,r=e.getFID,c=e.getFCP,o=e.getLCP,a=e.getTTFB;n(t),r(t),c(t),o(t),a(t)}))};a.a.render(Object(y.jsx)(c.a.StrictMode,{children:Object(y.jsx)(F,{})}),document.getElementById("root")),I()},73:function(t,e,n){}},[[116,1,2]]]);
//# sourceMappingURL=main.f67c40db.chunk.js.map