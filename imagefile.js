
function compareImages(image1, image2) {
  // Get the two canvas elements.
  var canvas1 = document.createElement("canvas");
  var canvas2 = document.createElement("canvas");

  // Create image objects from the uploaded files.
  var img1 = new Image();
  img1.src = image1;

  var img2 = new Image();
  img2.src = image2;

  // Draw the two images onto the canvas elements once they are loaded.
  img1.onload = function() {
    canvas1.width = img1.width;
    canvas1.height = img1.height;
    canvas1.getContext("2d").drawImage(img1, 0, 0);
  }

  img2.onload = function() {
    canvas2.width = img2.width;
    canvas2.height = img2.height;
    canvas2.getContext("2d").drawImage(img2, 0, 0);

    // Get the pixel data from the two canvas elements.
    var pixels1 = canvas1.getContext("2d").getImageData(0, 0, canvas1.width, canvas1.height);
    var pixels2 = canvas2.getContext("2d").getImageData(0, 0, canvas2.width, canvas2.height);

    // Compare the pixel data from the two canvas elements.
    var isSimilar = true;
    for (var i = 0; i < pixels1.data.length; i += 4) {
      var red1 = pixels1.data[i];
      var green1 = pixels1.data[i + 1];
      var blue1 = pixels1.data[i + 2];
      var alpha1 = pixels1.data[i + 3];

      var red2 = pixels2.data[i];
      var green2 = pixels2.data[i + 1];
      var blue2 = pixels2.data[i + 2];
      var alpha2 = pixels2.data[i + 3];

      if (red1 !== red2 || green1 !== green2 || blue1 !== blue2 || alpha1 !== alpha2) {
        isSimilar = false;
        break;
      }
    }

    // Update the result element with the similarity result.
    document.getElementById("result").innerHTML = isSimilar ? "The images are similar." : "The images are not similar.";
  };
}

// Attach onchange event listeners to the input elements.
var productImage1 = document.getElementById("product-image1");
var productImage2 = document.getElementById("product-image2");

productImage1.addEventListener("change", function() {
  if (productImage1.files.length > 0 && productImage2.files.length > 0) {
    compareImages(URL.createObjectURL(productImage1.files[0]), URL.createObjectURL(productImage2.files[0]));
  }
});

productImage2.addEventListener("change", function() {
  if (productImage1.files.length > 0 && productImage2.files.length > 0) {
    compareImages(URL.createObjectURL(productImage1.files[0]), URL.createObjectURL(productImage2.files[0]));
  }
});
