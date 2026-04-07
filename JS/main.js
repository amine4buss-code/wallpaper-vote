/* =========================
   MAIN JAVASCRIPT FILE
   ========================= */

document.addEventListener("DOMContentLoaded", function () {

    console.log("Site loaded successfully 🚀");

    /* =========================
       Mobile Menu (future use)
       ========================= */
    const menuToggle = document.querySelector(".menu-toggle");
    const nav = document.querySelector("nav");

    if(menuToggle){
        menuToggle.addEventListener("click", () => {
            nav.classList.toggle("active");
        });
    }

    /* =========================
       Wallpaper Download Button
       ========================= */

    const downloadButtons = document.querySelectorAll(".download-btn");

    downloadButtons.forEach(button => {
        button.addEventListener("click", function(){

            const imageURL = this.getAttribute("data-image");

            if(imageURL){
                const link = document.createElement("a");
                link.href = imageURL;
                link.download = "wallpaper.jpg";
                link.click();
            }

        });
    });

    /* =========================
       Image Preview (Mockup idea)
       ========================= */

    const previewImages = document.querySelectorAll(".wallpaper");

    previewImages.forEach(img => {

        img.addEventListener("click", function(){

            const viewer = document.createElement("div");
            viewer.classList.add("image-viewer");

            viewer.innerHTML = `
                <div class="viewer-content">
                    <img src="${this.src}" alt="Wallpaper Preview">
                    <span class="close-viewer">✖</span>
                </div>
            `;

            document.body.appendChild(viewer);

            viewer.querySelector(".close-viewer").onclick = () => {
                viewer.remove();
            };

        });

    });

});
