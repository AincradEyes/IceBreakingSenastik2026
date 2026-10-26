import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getAuth, signInAnonymously } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import {
  getFirestore, collection, addDoc, serverTimestamp,
  query, orderBy, limit, onSnapshot
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

/*
  PENTING: ganti nilai di bawah dengan konfigurasi dari Firebase Console.
  Project settings > Your apps > SDK setup and configuration > Config.
*/
const firebaseConfig = {
  apiKey: "AIzaSyD0SR2w99T11IeWlZGlWEkxCsJMKhSwTs4",
  authDomain: "icebreakingsenastik2026-293ea.firebaseapp.com",
  projectId: "icebreakingsenastik2026-293ea",
  storageBucket: "icebreakingsenastik2026-293ea.firebasestorage.app",
  messagingSenderId: "10522824205",
  appId: "1:10522824205:web:4f3a6280321e53949fcf44"
};

const SOAL = [
{kategori:"SAINS",gambar:"⚛️ + 🧪",petunjuk:"Ilmu yang mempelajari materi, energi, dan fenomena alam.",jawaban:"Sains"},
{kategori:"SAINS",gambar:"🧬 + 👨‍🔬",petunjuk:"Mempelajari gen, DNA, dan makhluk hidup.",jawaban:"Bioteknologi"},
{kategori:"SAINS",gambar:"🌍 + 🌱 + ♻️",petunjuk:"Menjaga bumi agar tetap lestari untuk generasi mendatang.",jawaban:"Lingkungan berkelanjutan"},
{kategori:"TEKNOLOGI",gambar:"🤖 + 🧠",petunjuk:"Teknologi yang memungkinkan komputer belajar dan menyelesaikan masalah.",jawaban:"Kecerdasan Buatan (AI)"},
{kategori:"TEKNOLOGI",gambar:"☁️ + 💾",petunjuk:"Menyimpan dan mengakses data melalui internet.",jawaban:"Cloud Computing"},
{kategori:"TEKNOLOGI",gambar:"💻 + 👨‍💻 + { }",petunjuk:"Menulis instruksi agar komputer menjalankan perintah.",jawaban:"Pemrograman (Coding)"},
{kategori:"BISNIS",gambar:"🏪 + 🛒",petunjuk:"Kegiatan menjual barang atau jasa kepada pelanggan.",jawaban:"Bisnis atau perdagangan"},
{kategori:"BISNIS",gambar:"💡 + 📈",petunjuk:"Ide baru yang dikembangkan untuk menciptakan nilai dan peluang usaha.",jawaban:"Inovasi bisnis"},
{kategori:"BISNIS",gambar:"📱 + 🛍️ + 🌐",petunjuk:"Membeli dan menjual produk melalui internet.",jawaban:"E-commerce"},
{kategori:"BISNIS",gambar:"🚀 + 💰 + 📊",petunjuk:"Usaha rintisan yang biasanya berupaya tumbuh cepat dengan memanfaatkan teknologi.",jawaban:"Startup"},
{kategori:"BABAK FINAL",gambar:"🧠 + 🤖 + 💰",petunjuk:"AI yang dimanfaatkan untuk menghasilkan nilai ekonomi.",jawaban:"Bisnis berbasis AI"},
{kategori:"BABAK FINAL",gambar:"🌱 + ⚙️ + 💵",petunjuk:"Teknologi ramah lingkungan yang juga memiliki nilai ekonomi.",jawaban:"Teknologi hijau"},
{kategori:"BABAK FINAL",gambar:"🔬 + 💻 + 🚀",petunjuk:"Riset dan teknologi dikembangkan menjadi produk atau usaha baru.",jawaban:"Inovasi teknologi dan kewirausahaan"}
];

const $ = id => document.getElementById(id);
let index=0, score=0, seconds=15, timer=null, answered=false, participant="", firebaseReady=false, db=null, auth=null, unsubscribeLeaderboard=null;

function showScreen(name){["intro","game","result"].forEach(id=>$(id).classList.toggle("hidden",id!==name))}
function stopTimer(){if(timer!==null)clearInterval(timer);timer=null}
function configIsReady() {
  return Boolean(
    firebaseConfig.apiKey &&
    firebaseConfig.authDomain &&
    firebaseConfig.projectId &&
    firebaseConfig.storageBucket &&
    firebaseConfig.messagingSenderId &&
    firebaseConfig.appId
  );
}
async function initializeBackend(){
  if(!configIsReady()){ $("setupStatus").textContent="Konfigurasi Firebase belum lengkap. Permainan bisa dicoba, tetapi skor belum dapat disimpan."; return false; }
  try {
    const app=initializeApp(firebaseConfig);
    auth=getAuth(app); db=getFirestore(app);
    await signInAnonymously(auth);
    firebaseReady=true;
    listenLeaderboard();
    $("setupStatus").textContent="Terhubung ke Firebase. Skor akan dikirim setelah permainan selesai.";
    return true;
  } catch(err) {
    console.error(err);
    $("setupStatus").textContent="Firebase belum terhubung: "+(err.code || err.message)+" — periksa konfigurasi dan Anonymous Authentication.";
    return false;
  }
}
function listenLeaderboard(){
  if(!db) return;
  if(unsubscribeLeaderboard) unsubscribeLeaderboard();
  const q=query(collection(db,"scores"),orderBy("score","desc"),limit(20));
  unsubscribeLeaderboard=onSnapshot(q,snap=>{
    const list=$("leaderboardList"); list.replaceChildren();
    if(snap.empty){const li=document.createElement("li");li.textContent="Belum ada skor. Jadilah peserta pertama!";list.append(li);return;}
    snap.docs.forEach((doc,i)=>{
      const data=doc.data(); const li=document.createElement("li");
      const who=document.createElement("span"); who.textContent=data.name || "Peserta";
      const points=document.createElement("strong"); points.textContent=`${Number(data.score)||0} poin`;
      li.append(who,points); list.append(li);
    });
  },err=>{
    console.error(err); $("leaderboardList").innerHTML="<li>Leaderboard belum dapat dimuat. Periksa Firestore Rules.</li>";
  });
}
async function startGame(){
  participant=$("participantName").value.trim();
  if(!participant){$("setupStatus").textContent="Masukkan nama peserta terlebih dahulu."; $("participantName").focus();return;}
  if(participant.length>50){$("setupStatus").textContent="Nama maksimal 50 karakter.";return;}
  stopTimer();index=0;score=0;showScreen("game");renderQuestion();
}
function renderQuestion(){
 stopTimer();if(index>=SOAL.length){showResult();return}
 const q=SOAL[index];seconds=15;answered=false;
 $("progress").textContent=`SOAL ${index+1} / ${SOAL.length}`;$("score").textContent=`SKOR: ${score}`;
 $("category").textContent=q.kategori;$("picture").textContent=q.gambar;$("hint").textContent=`Petunjuk: ${q.petunjuk}`;
 $("answer").textContent="";$("answer").classList.add("hidden");$("revealBtn").disabled=false;$("nextBtn").disabled=false;$("timer").textContent=`Waktu: ${seconds} detik`;
 timer=setInterval(()=>{seconds--;$("timer").textContent=`Waktu: ${seconds} detik`;if(seconds<=0){stopTimer();$("timer").textContent="Waktu habis!";revealAnswer()}},1000);
}
function revealAnswer(){if(answered)return;answered=true;stopTimer();$("answer").textContent=`✅ Jawaban: ${SOAL[index].jawaban}`;$("answer").classList.remove("hidden");$("revealBtn").disabled=true;$("timer").textContent="Jawaban ditampilkan"}
function nextQuestion(){if(!answered) revealAnswer(); $("gradingDialog").showModal()}
function grade(correct){$("gradingDialog").close();if(correct)score+=10;index++;renderQuestion()}
async function showResult(){
 stopTimer();showScreen("result");$("finalScore").textContent=`${score} / ${SOAL.length*10}`;
 $("finalMessage").textContent=score>=100?"Luar biasa! Kalian tim yang hebat! 🏆":score>=60?"Bagus! Pengetahuan kalian keren! 👏":"Tetap semangat, belajar sambil bermain! 💪";
 $("saveStatus").textContent="Mengirim skor…";
 if(!firebaseReady || !auth?.currentUser || !db){$("saveStatus").textContent="Skor belum disimpan karena Firebase belum terhubung. Konfigurasi Firebase perlu dilengkapi.";return;}
 try{
   await addDoc(collection(db,"scores"),{
     name:participant, score, total:SOAL.length*10,
     uid:auth.currentUser.uid, createdAt:serverTimestamp()
   });
   $("saveStatus").textContent="Skor berhasil dikirim ke leaderboard. Terima kasih, "+participant+"!";
 }catch(err){
   console.error(err);$("saveStatus").textContent="Skor gagal disimpan ("+(err.code||err.message)+"). Periksa Firestore Rules.";
 }
}
function toggleFullscreen(){if(!document.fullscreenElement)document.documentElement.requestFullscreen?.().catch(()=>{});else document.exitFullscreen?.()}
$("startBtn").addEventListener("click",startGame);
$("replayBtn").addEventListener("click",()=>{showScreen("intro");$("participantName").value=participant;});
$("revealBtn").addEventListener("click",revealAnswer);
$("nextBtn").addEventListener("click",nextQuestion);
$("correctBtn").addEventListener("click",()=>grade(true));
$("wrongBtn").addEventListener("click",()=>grade(false));
$("cancelBtn").addEventListener("click",()=>$("gradingDialog").close());
document.addEventListener("keydown",e=>{if(e.key.toLowerCase()==="f"&&!$("gradingDialog").open)toggleFullscreen();if(e.key==="Escape"&&$("gradingDialog").open)$("gradingDialog").close()});
initializeBackend();
