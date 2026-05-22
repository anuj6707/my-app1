import { useState, useEffect } from 'react';
import Login from './Login';
import Quiz from './Quiz';
import './App.css';

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const user = localStorage.getItem('currentUser');
    if (user) {
      setCurrentUser(user);
    }
  }, []);

  const handleLogin = (username) => {
    setCurrentUser(username);
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
  };

  return (
    <div className="app">
      {!currentUser ? (
        <Login onLogin={handleLogin} />
      ) : (
        <Quiz username={currentUser} onLogout={handleLogout} />
      )}
    </div>
  );
}

  const sendChat = async () => {
    if (!chatInput.trim()||chatLoading) return;
    const userMsg={role:"user",content:chatInput};
    const next=[...chatMsgs,userMsg];
    setChatMsgs(next); setChatInput(""); setChatLoading(true);
    try {
      const res=await fetch("https://api.anthropic.com/v1/messages",{
        method:"POST",headers:{"Content-Type":"application/json","x-api-key":process.env.REACT_APP_ANTHROPIC_KEY||""},
        body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:800,
          system:"You are a concise math tutor for BSH22BS07 Multivariate Calculus (PCCOE, Pune University). Focus on double/triple integrals, coordinate systems, volume. Be short and clear.",
          messages:next.map(m=>({role:m.role,content:m.content}))})
      });
      const data=await res.json();
      setChatMsgs(p=>[...p,{role:"assistant",content:data.content?.[0]?.text||"Sorry, try again."}]);
    } catch { setChatMsgs(p=>[...p,{role:"assistant",content:"Connection error."}]); }
    setChatLoading(false);
  };

  const TABS=["Visualizer","Theory","Practice"];

  return (
    <div style={{minHeight:"100vh",background:"#0f172a",color:C.text,fontFamily:"'Segoe UI',sans-serif",display:"flex",flexDirection:"column"}}>
      <style>{`
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        @keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}
        @keyframes dot{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}
        button:focus{outline:none;}
        input[type=range]{-webkit-appearance:none;appearance:none;height:5px;border-radius:9999px;cursor:pointer;}
        input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:14px;height:14px;border-radius:50%;background:#fff;box-shadow:0 0 0 3px rgba(167,139,250,0.45);cursor:pointer;}
        .tab-btn{padding:8px 18px;border-radius:8px;border:none;cursor:pointer;font-size:13px;font-weight:600;transition:all 0.18s;}
        .theory-pre{white-space:pre-line;font-size:13px;line-height:1.85;color:#94a3b8;margin:0;}
      `}</style>

      {/* ── Top Nav ── */}
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 28px",borderBottom:"1px solid #1e293b",background:"rgba(15,23,42,0.95)",backdropFilter:"blur(8px)",position:"sticky",top:0,zIndex:50}}>
        <div>
          <span style={{fontSize:18,fontWeight:800,color:"#a78bfa",letterSpacing:-0.5}}>CalcLab 3D</span>
          <span style={{fontSize:10,color:"#475569",marginLeft:10}}>BSH22BS07 · PCCOE · AY 2025-26</span>
        </div>
        <div style={{display:"flex",gap:6}}>
          {TABS.map(t=>(
            <button key={t} className="tab-btn"
              style={{background:activeTab===t.toLowerCase()?"rgba(124,58,237,0.2)":"transparent",color:activeTab===t.toLowerCase()?"#a78bfa":"#64748b",border:activeTab===t.toLowerCase()?"1px solid rgba(124,58,237,0.4)":"1px solid transparent"}}
              onClick={()=>setActiveTab(t.toLowerCase())}>
              {t==="Visualizer"?"🔭":t==="Theory"?"📖":"📝"} {t}
            </button>
          ))}
        </div>
      </div>

      {/* ── Content ── */}
      <div style={{flex:1,animation:"fadeUp 0.3s ease"}}>
        {activeTab==="visualizer" && <VolumeVisualizerTab />}
        {activeTab==="theory" && <TheoryTab />}
        {activeTab==="practice" && <PracticeTab />}
      </div>

      {/* ── Chat Button ── */}
      <button onClick={()=>setChatOpen(o=>!o)}
        style={{position:"fixed",bottom:28,right:28,background:"linear-gradient(135deg,#4f46e5,#7c3aed)",color:"#fff",padding:"13px 20px",borderRadius:50,boxShadow:"0 8px 28px rgba(79,70,229,0.5)",border:"none",cursor:"pointer",fontWeight:700,fontSize:14,zIndex:200,animation:"bounce 2.5s infinite"}}>
        💬 AI Tutor
      </button>

      {/* ── Chat Drawer ── */}
      {chatOpen && (
        <div style={{position:"fixed",bottom:90,right:28,width:340,height:480,background:"#1e293b",borderRadius:20,boxShadow:"0 16px 56px rgba(0,0,0,0.5)",border:"1px solid #334155",display:"flex",flexDirection:"column",overflow:"hidden",zIndex:200}}>
          <div style={{background:"linear-gradient(135deg,#4f46e5,#7c3aed)",padding:"12px 16px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <div style={{width:32,height:32,borderRadius:"50%",background:"rgba(255,255,255,0.15)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>🤖</div>
              <div>
                <div style={{color:"#fff",fontWeight:700,fontSize:13}}>AI Tutor</div>
                <div style={{color:"rgba(255,255,255,0.6)",fontSize:10}}>BSH22BS07 · Multiple Integrals</div>
              </div>
            </div>
            <button onClick={()=>setChatOpen(false)} style={{background:"rgba(255,255,255,0.15)",border:"none",color:"#fff",width:26,height:26,borderRadius:"50%",cursor:"pointer",fontSize:16}}>×</button>
          </div>
          <div style={{flex:1,overflowY:"auto",padding:12,display:"flex",flexDirection:"column",gap:8}}>
            {chatMsgs.map((m,i)=>(
              <div key={i} style={{display:"flex",justifyContent:m.role==="user"?"flex-end":"flex-start"}}>
                <div style={{maxWidth:"82%",padding:"8px 12px",borderRadius:m.role==="user"?"14px 14px 4px 14px":"14px 14px 14px 4px",background:m.role==="user"?"linear-gradient(135deg,#6366f1,#8b5cf6)":"rgba(255,255,255,0.06)",color:m.role==="user"?"#fff":"#cbd5e1",fontSize:12,lineHeight:1.6,whiteSpace:"pre-wrap",border:m.role==="assistant"?"1px solid #334155":"none"}}>{m.content}</div>
              </div>
            ))}
            {chatLoading && <div style={{display:"flex"}}><div style={{padding:"8px 12px",borderRadius:"14px 14px 14px 4px",background:"rgba(255,255,255,0.06)",border:"1px solid #334155",display:"flex",gap:4}}>{[0,1,2].map(i=><span key={i} style={{width:6,height:6,borderRadius:"50%",background:"#7c3aed",display:"inline-block",animation:`dot 0.7s infinite`,animationDelay:`${i*0.15}s`}}/>)}</div></div>}
            <div ref={chatBottomRef}/>
          </div>
          <div style={{padding:"10px 10px",borderTop:"1px solid #334155",display:"flex",gap:6}}>
            <input value={chatInput} onChange={e=>setChatInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendChat()} placeholder="Ask about integrals…" style={{flex:1,padding:"8px 12px",borderRadius:10,border:"1px solid #334155",background:"rgba(255,255,255,0.05)",fontSize:12,color:"#e2e8f0",outline:"none"}}/>
            <button onClick={sendChat} disabled={chatLoading||!chatInput.trim()} style={{padding:"8px 14px",borderRadius:10,background:"linear-gradient(135deg,#6366f1,#8b5cf6)",color:"#fff",border:"none",cursor:"pointer",fontWeight:700,fontSize:12,opacity:chatLoading||!chatInput.trim()?0.5:1}}>↑</button>
          </div>
        </div>
      )}
    </div>
  );
}

function VolumeVisualizerTab() {
  const [xMin,setXMin]=useState(0.5); const [xMax,setXMax]=useState(4.0);
  const [yMin,setYMin]=useState(0.5); const [yMax,setYMax]=useState(3.5);
  const [zMin,setZMin]=useState(0.5); const [zMax,setZMax]=useState(3.0);

  const limits={xMin,xMax,yMin,yMax,zMin,zMax};
  const vol=((xMax-xMin)*(yMax-yMin)*(zMax-zMin)).toFixed(3);
  const reset=()=>{ setXMin(0.5);setXMax(4.0);setYMin(0.5);setYMax(3.5);setZMin(0.5);setZMax(3.0); };

  return (
    <div style={{display:"flex",height:"calc(100vh - 53px)",overflow:"hidden"}}>
      <div style={{width:240,background:"#0f172a",borderRight:"1px solid #1e293b",display:"flex",flexDirection:"column",overflow:"auto",flexShrink:0}}>
        <div style={{padding:"16px 14px",display:"flex",flexDirection:"column",gap:12}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <span style={{fontSize:10,color:"#475569",textTransform:"uppercase",letterSpacing:2,fontWeight:700}}>Integration Limits</span>
            <button onClick={reset} style={{fontSize:10,padding:"4px 10px",borderRadius:8,background:"#1e293b",border:"1px solid #334155",color:"#94a3b8",cursor:"pointer"}}>↺ Reset</button>
          </div>

          {[
            {axis:"X",color:C.x,mn:xMin,mx:xMax,setMn:v=>setXMin(Math.min(v,xMax-0.5)),setMx:v=>setXMax(Math.max(v,xMin+0.5))},
            {axis:"Y",color:C.y,mn:yMin,mx:yMax,setMn:v=>setYMin(Math.min(v,yMax-0.5)),setMx:v=>setYMax(Math.max(v,yMin+0.5))},
            {axis:"Z",color:C.z,mn:zMin,mx:zMax,setMn:v=>setZMin(Math.min(v,zMax-0.5)),setMx:v=>setZMax(Math.max(v,zMin+0.5))},
          ].map(({axis,color,mn,mx,setMn,setMx})=>(
            <div key={axis} style={{background:"#1e293b",borderRadius:12,padding:"12px",border:"1px solid #334155"}}>
              <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:10}}>
                <div style={{width:8,height:8,borderRadius:"50%",background:color}}/>
                <span style={{fontSize:11,color:"#94a3b8",fontWeight:700,textTransform:"uppercase",letterSpacing:2}}>{axis}-Axis</span>
              </div>
              {[{label:`${axis}min`,val:mn,onChange:setMn,min:0,max:9.5},{label:`${axis}max`,val:mx,onChange:setMx,min:0.5,max:10}].map(({label,val,onChange,min,max})=>(
                <div key={label} style={{marginBottom:8}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                    <span style={{fontSize:11,color:color,fontWeight:600}}>{label}</span>
                    <span style={{fontSize:11,fontFamily:"monospace",background:"#0f172a",padding:"1px 7px",borderRadius:6,color:"#e2e8f0"}}>{val.toFixed(1)}</span>
                  </div>
                  <input type="range" min={min} max={max} step={0.5} value={val} onChange={e=>onChange(parseFloat(e.target.value))} style={{width:"100%",background:`linear-gradient(to right,${color} ${((val-min)/(max-min))*100}%,#334155 ${((val-min)/(max-min))*100}%)`}}/>
                </div>
              ))}
            </div>
          ))}

          <div style={{background:"#1e293b",borderRadius:12,padding:12,border:"1px solid #334155"}}>
            <div style={{fontSize:10,color:"#475569",textTransform:"uppercase",letterSpacing:2,fontWeight:700,marginBottom:10}}>Dimensions</div>
            {[["ΔX (Width)",xMax-xMin,C.x],["ΔY (Height)",yMax-yMin,C.y],["ΔZ (Depth)",zMax-zMin,C.z]].map(([lbl,val,col])=>(
              <div key={lbl} style={{display:"flex",justifyContent:"space-between",padding:"3px 0",borderBottom:"1px solid #0f172a"}}>
                <span style={{fontSize:11,color:"#64748b"}}>{lbl}</span>
                <span style={{fontSize:11,fontFamily:"monospace",fontWeight:700,color:col}}>{val.toFixed(1)}</span>
              </div>
            ))}
            <div style={{display:"flex",justifyContent:"space-between",marginTop:8}}>
              <span style={{fontSize:12,color:"#94a3b8",fontWeight:600}}>Volume</span>
              <span style={{fontSize:14,fontFamily:"monospace",fontWeight:800,color:"#a78bfa"}}>{vol}</span>
            </div>
          </div>

          <div style={{background:"rgba(59,130,246,0.08)",border:"1px solid rgba(59,130,246,0.2)",borderRadius:10,padding:10}}>
            <p style={{fontSize:11,color:"#93c5fd",lineHeight:1.6,margin:0}}>💡 <b>Drag</b> to orbit · <b>Scroll</b> to zoom · <b>Right-drag</b> to pan</p>
          </div>
        </div>
      </div>

      <div style={{flex:1,position:"relative",background:C.bg}}>
        <Canvas3D limits={limits}/>
        <div style={{position:"absolute",bottom:20,left:"50%",transform:"translateX(-50%)",background:"rgba(15,23,42,0.88)",backdropFilter:"blur(10px)",border:"1px solid #334155",borderRadius:20,padding:"12px 24px",textAlign:"center",pointerEvents:"none"}}><IntegralMath {...limits} vol={vol}/></div>
        <div style={{position:"absolute",top:16,right:16,background:"rgba(15,23,42,0.8)",backdropFilter:"blur(8px)",border:"1px solid #1e293b",borderRadius:12,padding:"10px 14px"}}>{[["X-axis",C.x],["Y-axis",C.y],["Z-axis",C.z],["Volume",C.vol]].map(([l,c])=>(<div key={l} style={{display:"flex",alignItems:"center",gap:8,marginBottom:5}}><div style={{width:14,height:2,background:c,borderRadius:2}}/><span style={{fontSize:11,color:"#64748b"}}>{l}</span></div>))}</div>
      </div>
    </div>
  );
}

function Canvas3D({limits}){const canvasRef=useRef(null);const state=useRef({rotY:0.5,rotX:0.35,zoom:1.1,panX:0,panY:0,dragging:false,button:0,lastX:0,lastY:0});const cur=useRef({xMin:limits.xMin,xMax:limits.xMax,yMin:limits.yMin,yMax:limits.yMax,zMin:limits.zMin,zMax:limits.zMax});const animRef=useRef(null);const onDown=useCallback(e=>{const s=state.current;s.dragging=true;s.button=e.button||0;s.lastX=e.clientX||e.touches?.[0]?.clientX||0;s.lastY=e.clientY||e.touches?.[0]?.clientY||0;e.preventDefault();},[]);const onMove=useCallback(e=>{const s=state.current;if(!s.dragging)return;const cx=e.clientX||(e.touches?.[0]?.clientX||s.lastX);const cy=e.clientY||(e.touches?.[0]?.clientY||s.lastY);const dx=(cx-s.lastX)*0.008,dy=(cy-s.lastY)*0.008;if(s.button===2||e.ctrlKey){s.panX+=dx*2;s.panY-=dy*2;}else{s.rotY+=dx;s.rotX=Math.max(-1.2,Math.min(1.2,s.rotX+dy));}s.lastX=cx;s.lastY=cy;},[]);const onUp=useCallback(()=>{state.current.dragging=false;},[]);const onWheel=useCallback(e=>{state.current.zoom=Math.max(0.4,Math.min(2.5,state.current.zoom*(e.deltaY>0?0.92:1.08)));e.preventDefault();},[]);useEffect(()=>{const canvas=canvasRef.current;if(!canvas)return;const ctx=canvas.getContext("2d");const spd=0.1;const draw=()=>{const W=canvas.width,H=canvas.height;const s=state.current,c=cur.current,l=limits;c.xMin=lerp(c.xMin,l.xMin,spd);c.xMax=lerp(c.xMax,l.xMax,spd);c.yMin=lerp(c.yMin,l.yMin,spd);c.yMax=lerp(c.yMax,l.yMax,spd);c.zMin=lerp(c.zMin,l.zMin,spd);c.zMax=lerp(c.zMax,l.zMax,spd);ctx.clearRect(0,0,W,H);ctx.fillStyle=C.bg;ctx.fillRect(0,0,W,H);const mY=mat4RotY(s.rotY),mX=mat4RotX(s.rotX);const mRot=mat4Multiply(mX,mY);const off=[s.panX-3,s.panY-1.5,0];const tp=pt=>{const r=transformPoint(mRot,[pt[0]+off[0],pt[1]+off[1],pt[2]+off[2]]);return project(r,W,H,s.zoom);};ctx.lineWidth=0.5;ctx.strokeStyle=C.gridLine+"88";for(let i=-1;i<=8;i++){ctx.beginPath();const a=tp([i,0,-1]),b=tp([i,0,8]);ctx.moveTo(...a);ctx.lineTo(...b);ctx.stroke();ctx.beginPath();const c2=tp([-1,0,i]),d=tp([8,0,i]);ctx.moveTo(...c2);ctx.lineTo(...d);ctx.stroke();}const axes=[{from:[0,0,0],to:[7,0,0],color:C.x,label:"X",lp:[7.5,0,0]},{from:[0,0,0],to:[0,7,0],color:C.y,label:"Y",lp:[0,7.5,0]},{from:[0,0,0],to:[0,0,7],color:C.z,label:"Z",lp:[0,0,7.5]},];axes.forEach(({from,to,color,label,lp})=>{ctx.beginPath();ctx.moveTo(...tp(from));ctx.lineTo(...tp(to));ctx.strokeStyle=color;ctx.lineWidth=2;ctx.stroke();const lpos=tp(lp);ctx.fillStyle=color;ctx.font="bold 13px monospace";ctx.textAlign="center";ctx.fillText(label,...lpos);});for(let i=1;i<=6;i++){[[i,0,0,C.x],[0,i,0,C.y],[0,0,i,C.z]].forEach(([x,y,z,col])=>{const p=tp([x,y,z]);ctx.beginPath();ctx.arc(...p,2,0,Math.PI*2);ctx.fillStyle=col+"88";ctx.fill();ctx.fillStyle="#475569";ctx.font="9px monospace";ctx.textAlign="center";ctx.fillText(i,p[0]+5,p[1]-3);});}const {xMin:x0,xMax:x1,yMin:y0,yMax:y1,zMin:z0,zMax:z1}=c;const corners=[[x0,y0,z0],[x1,y0,z0],[x1,y1,z0],[x0,y1,z0],[x0,y0,z1],[x1,y0,z1],[x1,y1,z1],[x0,y1,z1],].map(tp);const faces=[[0,1,2,3],[4,5,6,7],[0,1,5,4],[2,3,7,6],[1,2,6,5],[0,3,7,4]];const rawPts=[[x0,y0,z0],[x1,y0,z0],[x1,y1,z0],[x0,y1,z0],[x0,y0,z1],[x1,y0,z1],[x1,y1,z1],[x0,y1,z1]];const depths=faces.map(f=>{const avg=f.reduce((acc,i)=>acc+transformPoint(mat4Multiply(mat4RotX(s.rotX),mat4RotY(s.rotY)),[rawPts[i][0]+off[0],rawPts[i][1]+off[1],rawPts[i][2]+off[2]])[2],0)/4;return {f,avg};}).sort((a,b)=>a.avg-b.avg);depths.forEach(({f})=>{ctx.beginPath();ctx.moveTo(...corners[f[0]]);f.slice(1).forEach(i=>ctx.lineTo(...corners[i]));ctx.closePath();ctx.fillStyle="rgba(167,139,250,0.13)";ctx.fill();ctx.strokeStyle=C.volWire;ctx.lineWidth=1.2;ctx.stroke();});const edges=[[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]];ctx.strokeStyle=C.vol;ctx.lineWidth=1.8;edges.forEach(([a,b])=>{ctx.beginPath();ctx.moveTo(...corners[a]);ctx.lineTo(...corners[b]);ctx.stroke();});corners.forEach(p=>{ctx.beginPath();ctx.arc(...p,3,0,Math.PI*2);ctx.fillStyle=C.vol;ctx.fill();});animRef.current=requestAnimationFrame(draw);};draw();return ()=>cancelAnimationFrame(animRef.current);},[limits]);useEffect(()=>{const canvas=canvasRef.current;if(!canvas)return;const ro=new ResizeObserver(entries=>{for(const e of entries){canvas.width=e.contentRect.width;canvas.height=e.contentRect.height;}});ro.observe(canvas.parentElement);canvas.width=canvas.parentElement.clientWidth;canvas.height=canvas.parentElement.clientHeight;return ()=>ro.disconnect();},[]);return(<canvas ref={canvasRef} style={{width:"100%",height:"100%",display:"block",cursor:"grab",touchAction:"none"}} onMouseDown={onDown} onMouseMove={onMove} onMouseUp={onUp} onMouseLeave={onUp} onTouchStart={onDown} onTouchMove={onMove} onTouchEnd={onUp} onWheel={onWheel} onContextMenu={e=>e.preventDefault()}/>);}

function IntegralMath({xMin,xMax,yMin,yMax,zMin,zMax,vol}){const B=({v,c})=><span style={{fontFamily:"monospace",fontWeight:700,fontSize:12,color:c}}>{Number(v).toFixed(1)}</span>;const Int=({top,bot,tc,bc})=>(<span style={{display:"inline-flex",flexDirection:"column",alignItems:"center",margin:"0 2px",lineHeight:1}}><B v={top} c={tc}/><span style={{fontSize:26,color:"#e2e8f0",fontFamily:"serif",lineHeight:0.9}}>∫</span><B v={bot} c={bc}/></span>);return(<div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:8}}><div style={{display:"flex",alignItems:"center",gap:4,color:"#e2e8f0",flexWrap:"wrap",justifyContent:"center"}}><span style={{color:C.vol,fontWeight:700,fontSize:14}}>V</span><span style={{color:"#64748b",fontSize:14}}>=</span><Int top={xMax} bot={xMin} tc={C.x} bc={C.x}/><Int top={yMax} bot={yMin} tc={C.y} bc={C.y}/><Int top={zMax} bot={zMin} tc={C.z} bc={C.z}/><span style={{fontFamily:"monospace",fontSize:13,color:"#94a3b8",marginLeft:4}}>1 dz dy dx</span></div><div style={{display:"flex",alignItems:"center",gap:8,background:"rgba(124,58,237,0.2)",border:"1px solid rgba(167,139,250,0.35)",borderRadius:20,padding:"4px 16px"}}><span style={{color:"#a78bfa",fontSize:12,fontWeight:600}}>Volume</span><span style={{fontFamily:"monospace",fontWeight:800,fontSize:15,color:"#fff"}}>{vol}</span><span style={{color:"#7c3aed",fontSize:11}}>cubic units</span></div></div>);}

const THEORY=[{title:"Introduction to Multiple Integration",color:"#818cf8",body:`Multiple integration is used when a function depends on more than one variable.
• Double Integration → Function of two variables: z = f(x,y)
• Triple Integration → Function of three variables: f(x,y,z)

Applications: Area calculation, Volume, Mass & density, Engineering analysis.`},{title:"Double Integration — Definition & Types",color:"#38bdf8",body:`∬_R f(x,y) dA, where R is a region in the XY-plane.
• f(x,y)=1 → Area = ∬_R dA
• f(x,y) general → Volume = ∬_R f(x,y) dA

Types: Rectangular region (constant limits), Variable limits.
Steps: Identify region → Graph → Choose order → Write limits → Integrate.`},{title:"Polar Coordinates",color:"#34d399",body:`Used for circles, annuli, cardioids, sectors.
  x = r cosθ,  y = r sinθ,  x²+y² = r²
  Area element: dx dy = r dr dθ
  ∬_R f(x,y) dx dy = ∫∫ f(r cosθ, r sinθ)·r dr dθ`},{title:"Area Using Double Integration",color:"#fb923c",body:`Cartesian: Area = ∬_R dA
Polar: Area = ∫∫ r dr dθ

Examples:
• Area of cardioid r=a(1+cosθ) → A = 3πa²/2
• Area between y=x² and y=x → Use variable limits`},{title:"Triple Integration",color:"#a78bfa",body:`∭_V f(x,y,z) dV, where V is a 3D region.
Setting f=1 gives: Volume = ∭_V dV

Steps: Identify solid → Write limits (inner to outer) → Integrate stepwise.
Applications: Volume of solids, Mass, Center of mass, Moment of inertia.`},{title:"Cylindrical Coordinates",color:"#4ade80",body:`Used for cylinders, paraboloids, circular symmetry.
  x = r cosθ,  y = r sinθ,  z = z
  dV = r dr dθ dz  (Jacobian = r)

Best when integrand/region involves x²+y².`},{title:"Spherical Coordinates",color:"#c084fc",body:`Used for spheres, cones, hemispheres.
  x = r sinφ cosθ,  y = r sinφ sinθ,  z = r cosφ
  dV = r² sinφ dr dφ dθ  (Jacobian = r² sinφ)
  Ranges: r≥0, θ∈[0,2π], φ∈[0,π]`},{title:"Important Surfaces",color:"#f59e0b",body:`Sphere:     x²+y²+z² = a²
Cylinder:   x²+y² = a²
Cone:       z = √(x²+y²)  i.e. x²+y² = z²
Paraboloid: z = x²+y²

These surfaces define integration limits in most problems.`},{title:"Applications Summary",color:"#f87171",body:`Double Integration: Area, surface volume, mass of lamina (∬ ρ(x,y) dA)
Triple Integration: Volume (∭_V dV), center of mass, moment of inertia (∭ r² dm)

Coordinate transforms simplify complicated regions and are essential in engineering mathematics.`},];function TheoryTab(){const [open,setOpen]=useState(null);return(<div style={{maxWidth:860,margin:"0 auto",padding:"28px 20px",display:"flex",flexDirection:"column",gap:10}}><h2 style={{fontSize:22,fontWeight:300,color:"#c4b5fd",marginBottom:4}}>Theory Module</h2><p style={{fontSize:12,color:"#475569",marginBottom:10}}>Unit IV — Multiple Integral · BSH22BS07 · PCCOE</p>{THEORY.map((s,i)=>(<div key={i} style={{borderRadius:14,border:`1px solid ${s.color}30`,overflow:"hidden"}}><div onClick={()=>setOpen(open===i?null:i)} style={{padding:"14px 18px",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center",background:`${s.color}0c`}}><span style={{fontSize:14,fontWeight:700,color:s.color}}>{s.title}</span><span style={{color:s.color,fontSize:18,transform:open===i?"rotate(180deg)":"none",transition:"transform 0.2s"}}>⌄</span></div>{open===i&&(<div style={{padding:"0 18px 16px",background:"rgba(15,23,42,0.5)"}}><p className="theory-pre" style={{paddingTop:12,color:"#94a3b8",fontSize:13,lineHeight:1.85,whiteSpace:"pre-line"}}>{s.body}</p></div>)}</div>))}</div>);}const PRACTICE_TYPES=[{label:"Type I – Direct Evaluation",color:"#818cf8",problems:[{q:"Evaluate ∫₀¹ ∫₀^√(1+x²) dx dy / (1+x²+y²)",hint:"Direct integration; result involves arctan",ans:"π/4 · log(1+√2)"},{q:"Evaluate ∫₀¹ ∫₀ˣ eʸ/ˣ dx dy",hint:"Integrate inner w.r.t. y first: ∫₀ˣ eʸ/ˣ dy = x(e−1)",ans:"(e−1)/2"},{q:"Evaluate ∫₀¹ ∫₀ʸ xy e^(−x²) dx dy",hint:"Switch order: ∫₀¹ xe^(−x²) ∫ₓ¹ y dy dx",ans:"1/(4e)"},{q:"Evaluate ∫₀^∞ ∫₀^∞ x e^(−x²(1+y²)) dx dy",hint:"Integrate x e^(−x²(1+y²)) w.r.t. x first",ans:"π/4"},]},{label:"Type II – Variable Limits",color:"#38bdf8",problems:[{q:"Evaluate ∬_R xy(x+y) dx dy bounded by y=x² and y=x",hint:"Intersections at (0,0)&(1,1). x:0→1, y:x²→x",ans:"3/56"},{q:"Evaluate ∬_R y dx dy bounded by y=x² and x+y=2",hint:"y limits: x²→(2−x), x: −1→1 (check intersections)",ans:"36/5"},{q:"Evaluate ∬_R xy dx dy bounded by x-axis, x=2a, x²=4ay",hint:"y: 0→x²/4a; x: 0→2a",ans:"a⁴/3"},{q:"Evaluate ∬_R xy dx dy bounded by x²=y and y²=−x",hint:"Intersect at (0,0) and (−1,1)",ans:"−1/12"},]},{label:"Type III – Polar Transform",color:"#34d399",problems:[{q:"Evaluate ∬_R sin(x²+y²) dx dy over circle x²+y²=a²",hint:"Polar: ∫₀^(2π)∫₀ᵃ sin(r²)·r dr dθ",ans:"π(1−cos a²)"},{q:"Evaluate ∬_R (x²y²)/(x²+y²) dx dy, annulus 4≤x²+y²≤9",hint:"r²cos²θ·r²sin²θ/r² = r²sin²θcos²θ; r:2→3",ans:"65π/16"},]},{label:"Type V – Area Problems",color:"#fb923c",problems:[{q:"Find area of cardioid r = a(1+cosθ)",hint:"A=∫₀^(2π)∫₀^(a(1+cosθ)) r dr dθ",ans:"3πa²/2"},{q:"Find area bounded by y=x² and y=2x+3",hint:"Intersect at x=−1 and x=3",ans:"32/3"},{q:"Find area enclosed between y²=4ax and x²=4ay",hint:"Intersect at (0,0) and (4a,4a)",ans:"16a²/3"},]},{label:"Type VI – Triple Integral (Limits Given)",color:"#f87171",problems:[{q:"Evaluate ∫₋₁¹ ∫₀ᶻ ∫ₓ₋ᶻ^(x+z) (x+y+z) dx dy dz",hint:"Integrate innermost first",ans:"0"},{q:"Evaluate ∫₀¹ ∫₀¹ ∫₀¹ e^(x+y+z) dx dy dz",hint:"Separates: [∫₀¹ eˣ dx]³ = (e−1)³",ans:"(e−1)³"},{q:"Evaluate ∫₀¹ ∫₀^(1−x) ∫₀^(x+y) eᶻ dx dy dz",hint:"Integrate eᶻ w.r.t. z first",ans:"1/2"},]},{label:"Type VII – Triple Integral (Limits Not Given)",color:"#a78bfa",problems:[{q:"Evaluate ∭_V x²yz dx dy dz over volume bounded by x=0,y=0,z=0, x/a+y/b+z/c=1",hint:"Use tetrahedron substitution u=x/a etc.",ans:"a³b²c²/2520"},{q:"Evaluate ∭_V (x+y+z) dx dy dz over tetrahedron x/a+y/b+z/c=1",hint:"By symmetry all three terms contribute equally",ans:"1/8"},{q:"Evaluate ∭_V (x²+y²) dx dy dz bounded by x²+y²=3z and z=3",hint:"Use cylindrical coords: z from r²/3 to 3",ans:"81π/2"},]},{label:"Type VIII – Spherical Polar",color:"#c084fc",problems:[{q:"Evaluate ∭_V dxdydz/(1+x²+y²+z²)² over positive octant",hint:"Spherical: r:0→∞, octant limits",ans:"π²/8"},{q:"Evaluate ∭_V xyz dx dy dz over x²+y²+z²=4, positive octant",hint:"x=ρsinφcosθ etc. Separate integrals",ans:"4/3"},]},{label:"Type IX – Volume Problems",color:"#4ade80",problems:[{q:"Find volume of paraboloid x²+y²=4z cut by plane z=4",hint:"Cylindrical: z from r²/4 to 4, r:0→4",ans:"32π"},{q:"Find volume enclosed by cone z=√(x²+y²) and paraboloid z=x²+y²",hint:"Cylindrical: cone z=r, paraboloid z=r²; intersect r=0,1",ans:"π/6"},{q:"Find volume of tetrahedron: coordinate planes and x/a+y/b+z/c=1",hint:"Integrate directly from the plane equation",ans:"abc/6"},]},];function PracticeTab(){const [openType,setOpenType]=useState(0);const [openQ,setOpenQ]=useState({});const [hint,setHint]=useState({});return(<div style={{maxWidth:860,margin:"0 auto",padding:"28px 20px",display:"flex",flexDirection:"column",gap:10}}><h2 style={{fontSize:22,fontWeight:300,color:"#c4b5fd",marginBottom:4}}>Practice Module</h2><p style={{fontSize:12,color:"#475569",marginBottom:10}}>BSH22BS07 Unit IV Question Bank · PCCOE · 2025-26</p>{PRACTICE_TYPES.map((type,ti)=>(<div key={ti} style={{borderRadius:14,border:`1px solid ${type.color}30`,overflow:"hidden"}}><div onClick={()=>setOpenType(openType===ti?-1:ti)} style={{padding:"13px 18px",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center",background:`${type.color}0c`}}><span style={{fontSize:13,fontWeight:700,color:type.color}}>{type.label}</span><div style={{display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:10,background:`${type.color}20`,color:type.color,padding:"2px 8px",borderRadius:20,fontWeight:600}}>{type.problems.length} Qs</span><span style={{color:type.color,fontSize:18,transform:openType===ti?"rotate(180deg)":"none",transition:"transform 0.2s"}}>⌄</span></div></div>{openType===ti&&(<div style={{padding:"8px 14px 14px",display:"flex",flexDirection:"column",gap:8}}>{type.problems.map((p,qi)=>{const k=`${ti}-${qi}`;return(<div key={qi} style={{borderRadius:10,border:"1px solid #1e293b",overflow:"hidden"}}><div onClick={()=>setOpenQ(q=>({...q,[k]:!q[k]}))} style={{padding:"11px 14px",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:8}}><span style={{fontFamily:"monospace",fontSize:12,fontWeight:600,color:"#e2e8f0",lineHeight:1.5,flex:1}}>{p.q}</span><span style={{color:type.color,fontSize:16,flexShrink:0,transform:openQ[k]?"rotate(180deg)":"none",transition:"transform 0.2s"}}>⌄</span></div>{openQ[k]&&(<div style={{padding:"0 14px 12px"}}><button onClick={()=>setHint(h=>({...h,[k]:!h[k]}))} style={{padding:"5px 12px",borderRadius:20,border:"1px solid #854d0e",background:hint[k]?"#422006":"transparent",color:"#fbbf24",cursor:"pointer",fontSize:11,fontWeight:600,marginBottom:8}}>{hint[k]?"Hide Hint":"💡 Hint"}</button>{hint[k]&&<div style={{padding:"8px 12px",borderRadius:8,background:"rgba(245,158,11,0.08)",border:"1px solid rgba(245,158,11,0.2)",fontSize:12,color:"#fcd34d",marginBottom:8,fontFamily:"monospace",lineHeight:1.6}}>{p.hint}</div>}<div style={{padding:"10px 14px",borderRadius:10,background:"rgba(34,197,94,0.07)",border:"1px solid rgba(34,197,94,0.2)"}}><div style={{fontSize:10,fontWeight:700,color:"#4ade80",marginBottom:4,textTransform:"uppercase",letterSpacing:1}}>✓ Answer</div><div style={{fontFamily:"monospace",fontSize:16,fontWeight:800,color:"#86efac"}}>{p.ans}</div></div></div>)}</div>);})}</div>)}</div>))}</div>);}

