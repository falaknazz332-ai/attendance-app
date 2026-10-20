(function(){
  var KEY='att:v1', students=[], toastTimer;

  var SAYS={
    here:['Slay, she’s here 💅','Present and iconic ✨','Showed up AND looked cute 🎀','On time. Who is she?!'],
    late:['Fashionably late 🐢','Traffic? Or a third outfit change? 👗','Arrived with iced coffee ☕'],
    gone:['Ghosted us 👻','Left us on read 💀','Absent. The group chat will hear about this.']
  };
  function pick(a){return a[Math.floor(Math.random()*a.length)];}

  function load(){
    try{var s=JSON.parse(localStorage.getItem(KEY));if(Array.isArray(s))students=s;}catch(e){}
  }
  function save(){
    try{localStorage.setItem(KEY,JSON.stringify(students));}catch(e){}
  }
  function esc(t){return String(t).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
  function $(id){return document.getElementById(id);}

  function toast(t){
    $('toast').textContent=t;
    clearTimeout(toastTimer);
    toastTimer=setTimeout(function(){$('toast').textContent='';},2600);
  }

  function verdictFor(total,marked,pct){
    if(!total) return 'No one here yet. Add your squad above 🎀';
    if(!marked) return 'Roll call time! Tap a button for each girlie 📋';
    if(pct===100) return 'Perfect attendance. Teacher’s pet energy 🎀';
    if(pct>=80) return 'Slay-ttendance! Most of the squad showed up ✨';
    if(pct>=50) return 'Mid turnout. Time to text the group chat 📱';
    return 'Did class get cancelled?? Where is everyone 💀';
  }

  function render(){
    var here=0,late=0,gone=0;
    students.forEach(function(s){
      if(s.status==='here')here++;else if(s.status==='late')late++;else if(s.status==='gone')gone++;
    });
    var total=students.length, marked=here+late+gone;
    var pct=total?Math.round((here+late)/total*100):0;
    $('nHere').textContent=here;$('nLate').textContent=late;$('nGone').textContent=gone;$('nAll').textContent=total;
    $('fill').style.width=pct+'%';
    $('verdict').textContent=verdictFor(total,marked,pct)+(total&&marked?'  ('+pct+'% showed up)':'');

    var list=$('list');
    if(!total){
      list.innerHTML='<li class="empty"><span class="big">🪩</span>Nobody on the list. Add a name or try the demo squad.</li>';
      return;
    }
    list.innerHTML=students.map(function(s){
      var label={here:'Present',late:'Late',gone:'Ghosted',none:'Not yet'}[s.status||'none'];
      var cls=s.status||'none';
      function b(st,txt){return '<button class="mini'+(s.status===st?' on':'')+'" data-id="'+s.id+'" data-st="'+st+'" aria-pressed="'+(s.status===st)+'">'+txt+'</button>';}
      return '<li class="row"><div class="name">'+esc(s.name)+'<span class="pill '+cls+'">'+label+'</span></div>'+
        '<div class="acts">'+b('here','Here 💅')+b('late','Late 🐢')+b('gone','Ghost 👻')+
        '<button class="mini del" data-id="'+s.id+'" data-del="1" aria-label="Remove '+esc(s.name)+'">✕</button></div></li>';
    }).join('');
  }

  function add(name){
    students.push({id:Date.now().toString(36)+Math.random().toString(36).slice(2,6),name:name,status:''});
  }

  $('addForm').addEventListener('submit',function(e){
    e.preventDefault();
    var v=$('nameInput').value.trim();
    if(!v){toast('Type a name first, babe 💌');return;}
    add(v);$('nameInput').value='';save();render();toast('Welcome to the squad, '+v+' 🎀');
  });

  $('list').addEventListener('click',function(e){
    var t=e.target.closest('button');if(!t)return;
    var id=t.getAttribute('data-id');
    var i=students.findIndex(function(s){return s.id===id;});
    if(i<0)return;
    if(t.getAttribute('data-del')){
      var n=students[i].name;students.splice(i,1);save();render();toast(n+' left the chat 👋');return;
    }
    var st=t.getAttribute('data-st');
    students[i].status=(students[i].status===st)?'':st;
    save();render();
    if(students[i].status) toast(students[i].name+': '+pick(SAYS[st]));
  });

  $('allHere').addEventListener('click',function(){
    if(!students.length){toast('Add some girlies first 🎀');return;}
    students.forEach(function(s){s.status='here';});save();render();toast('Full squad! Everyone’s here ✨');
  });
  $('resetDay').addEventListener('click',function(){
    students.forEach(function(s){s.status='';});save();render();toast('Fresh start. New day, new drama 🔄');
  });
  $('demo').addEventListener('click',function(){
    ['Aisha','Zara','Hira','Mehak','Sana','Noor'].forEach(function(n){
      if(!students.some(function(s){return s.name===n;}))add(n);
    });
    save();render();toast('Demo squad has entered the chat 🎀');
  });

  $('date').textContent=new Date().toLocaleDateString(undefined,{weekday:'long',day:'numeric',month:'long',year:'numeric'});
  load();render();
})();
