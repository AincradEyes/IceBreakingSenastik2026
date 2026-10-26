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
const $=id=>document.getElementById(id);let index=0,score=0,seconds=15,timer=null,answered=false;
function showScreen(name){["intro","game","result"].forEach(id=>$(id).classList.toggle("hidden",id!==name))}
function stopTimer(){if(timer!==null)clearInterval(timer);timer=null}
function startGame(){stopTimer();index=0;score=0;showScreen("game");renderQuestion()}
function renderQuestion(){
 stopTimer();if(index>=SOAL.length){showResult();return}
 const q=SOAL[index];seconds=15;answered=false;
 $("progress").textContent=`SOAL ${index+1} / ${SOAL.length}`;$("score").textContent=`SKOR: ${score}`;
 $("category").textContent=q.kategori;$("picture").textContent=q.gambar;$("hint").textContent=`Petunjuk: ${q.petunjuk}`;
 $("answer").textContent="";$("answer").classList.add("hidden");$("revealBtn").disabled=false;$("timer").textContent=`Waktu: ${seconds} detik`;
 timer=setInterval(()=>{seconds--;$("timer").textContent=`Waktu: ${seconds} detik`;if(seconds<=0){stopTimer();$("timer").textContent="Waktu habis!";revealAnswer()}},1000)
}
function revealAnswer(){if(answered)return;answered=true;stopTimer();$("answer").textContent=`✅ Jawaban: ${SOAL[index].jawaban}`;$("answer").classList.remove("hidden");$("revealBtn").disabled=true;$("timer").textContent="Jawaban ditampilkan"}
function nextQuestion(){$("gradingDialog").showModal()}
function grade(correct){$("gradingDialog").close();if(correct)score+=10;index++;renderQuestion()}
function showResult(){stopTimer();showScreen("result");$("finalScore").textContent=`${score} / ${SOAL.length*10}`;$("finalMessage").textContent=score>=100?"Luar biasa! Kalian tim yang hebat! 🏆":score>=60?"Bagus! Pengetahuan kalian keren! 👏":"Tetap semangat, belajar sambil bermain! 💪"}
function toggleFullscreen(){if(!document.fullscreenElement)document.documentElement.requestFullscreen?.().catch(()=>{});else document.exitFullscreen?.()}
$("startBtn").addEventListener("click",startGame);$("replayBtn").addEventListener("click",startGame);
$("revealBtn").addEventListener("click",revealAnswer);$("nextBtn").addEventListener("click",nextQuestion);
$("correctBtn").addEventListener("click",()=>grade(true));$("wrongBtn").addEventListener("click",()=>grade(false));
$("cancelBtn").addEventListener("click",()=>$("gradingDialog").close());
document.addEventListener("keydown",e=>{if(e.key.toLowerCase()==="f"&&!$("gradingDialog").open)toggleFullscreen();if(e.key==="Escape"&&$("gradingDialog").open)$("gradingDialog").close()});