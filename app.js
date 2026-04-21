// popup control
function closePopup() {
  document.getElementById("popup").classList.add("hidden");
}

// load notice
window.onload = async () => {
  try {
    const res = await fetch("notice.json");
    const data = await res.json();

    const seen = localStorage.getItem("notice_version");

    if (data.show && seen != data.version) {
      document.getElementById("popup-title").innerText = data.title;
      document.getElementById("popup-msg").innerText = data.message;
      document.getElementById("popup").classList.remove("hidden");

      localStorage.setItem("notice_version", data.version);
    }
  } catch(e) {}
};

// amount
function setAmount(v){
  if(v>0) document.getElementById("amount").value = v;
}

// install guide
function showInstallGuide(){
  alert(
`📲 วิธีติดตั้งแอป

1. กด ⋮ มุมขวาบน
2. เลือก "เพิ่มไปหน้าจอหลัก"

✨ ใช้งานเหมือนแอปจริง`
  );
}
