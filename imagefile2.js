function compareImages(image1, image2, image3, image4) {
    // Get the four canvas elements.
    var canvas1 = document.createElement("canvas");
    var canvas2 = document.createElement("canvas");
    var canvas3 = document.createElement("canvas");
    var canvas4 = document.createElement("canvas");
  
    // Create image objects from the uploaded files.
    var img1 = new Image();
    img1.src = image1;
  
    var img2 = new Image();
    img2.src = image2;
  
    var img3 = new Image();
    img3.src = image3;
  
    var img4 = new Image();
    img4.src = image4;
  
    // Draw the four images onto the canvas elements once they are loaded.
    img1.onload = function() {
      canvas1.width = img1.width;
      canvas1.height = img1.height;
      canvas1.getContext("2d").drawImage(img1, 0, 0);
    }
  
    img2.onload = function() {
      canvas2.width = img2.width;
      canvas2.height = img2.height;
      canvas2.getContext("2d").drawImage(img2, 0, 0);
    }
  
    img3.onload = function() {
      canvas3.width = img3.width;
      canvas3.height = img3.height;
      canvas3.getContext("2d").drawImage(img3, 0, 0);
    }
  
    img4.onload = function() {
      canvas4.width = img4.width;
      canvas4.height = img4.height;
      canvas4.getContext("2d").drawImage(img4, 0, 0);
  
      // Get the pixel data from the four canvas elements.
      var pixels1 = canvas1.getContext("2d").getImageData(0, 0, canvas1.width, canvas1.height);
      var pixels2 = canvas2.getContext("2d").getImageData(0, 0, canvas2.width, canvas2.height);
      var pixels3 = canvas3.getContext("2d").getImageData(0, 0, canvas3.width, canvas3.height);
      var pixels4 = canvas4.getContext("2d").getImageData(0, 0, canvas4.width, canvas4.height);
  
      // Compare the pixel data from the four canvas elements.
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
  
        var red3 = pixels3.data[i];
        var green3 = pixels3.data[i + 1];
        var blue3 = pixels3.data[i + 2];
        var alpha3 = pixels3.data[i + 3];
  
        var red4 = pixels4.data[i];
        var green4 = pixels4.data[i + 1];
        var blue4 = pixels4.data[i + 2];
        var alpha4 = pixels4.data[i + 3];
  
        if (red1 !== red2 || green1 !== green2 || blue1 !== blue2 || alpha1 !== alpha2 ||
            red1 !== red3 || green1 !== green3 || blue1 !== blue3 || alpha1 !== alpha3 ||
            red1 !== red4 || green1 !== green4 || blue1 !== blue4 || alpha1 !== alpha4) {
          isSimilar = false;
          break;
        }
      }
  
      // Update the result element with the similarity result.
      document.getElementById("result").innerHTML = isSimilar ? "The images are similar." : "The images are not similar.";
    };
  }
  
  var productImage1 = document.getElementById("product-image1");
  var productImage2 = document.getElementById("product-image2");
  var productImage3 = document.getElementById("product-image3");
  var productImage4 = document.getElementById("product-image4");
  
  productImage1.addEventListener("change", function() {
    if (productImage1.files.length > 0 && productImage2.files.length > 0 && productImage3.files.length > 0 && productImage4.files.length > 0) {
      compareImages(URL.createObjectURL(productImage1.files[0]), URL.createObjectURL(productImage2.files[0]), URL.createObjectURL(productImage3.files[0]), URL.createObjectURL(productImage4.files[0]));
    }
  });
  
  productImage2.addEventListener("change", function() {
    if (productImage1.files.length > 0 && productImage2.files.length > 0 && productImage3.files.length > 0 && productImage4.files.length > 0) {
      compareImages(URL.createObjectURL(productImage1.files[0]), URL.createObjectURL(productImage2.files[0]), URL.createObjectURL(productImage3.files[0]), URL.createObjectURL(productImage4.files[0]));
    }
  });
  
  productImage3.addEventListener("change", function() {
    if (productImage1.files.length > 0 && productImage2.files.length > 0 && productImage3.files.length > 0 && productImage4.files.length > 0) {
      compareImages(URL.createObjectURL(productImage1.files[0]), URL.createObjectURL(productImage2.files[0]), URL.createObjectURL(productImage3.files[0]), URL.createObjectURL(productImage4.files[0]));
    }
  });
  
  productImage4.addEventListener("change", function() {
    if (productImage1.files.length > 0 && productImage2.files.length > 0 && productImage3.files.length > 0 && productImage4.files.length > 0) {
      compareImages(URL.createObjectURL(productImage1.files[0]), URL.createObjectURL(productImage2.files[0]), URL.createObjectURL(productImage3.files[0]), URL.createObjectURL(productImage4.files[0]));
    }
  });