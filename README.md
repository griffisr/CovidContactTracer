# CovidContactTracer
 
<script>
  // Add the following script before the closing body tag
  // After loading the DOM tree (page)
  $(function() {     
      //when clicking on a link containing a Thumbnail
      $('a.guestname').click(function(e) {
      //cancel the default browser action
      e.preventDefault();
      //set the scr attribute of the modal's img element
      //the value of the scr attribute of the image that is wrapped around the a element clicked by the user

      console.log("click event logged")
      document.getElementById("INFOguestName").innerHTML = "A Covid-19 contact tracing program.";
      document.getElementById("INFOtimeIn").innerHTML = "Technology Used:";
      document.getElementById("INFOtimeOut").innerHTML = "HTML,CSS,Javascript,Google User Authentication,Firebase,and AWS:(S3/Route53/API Gateway)";
      document.getElementById("INFOcontactInfo").innerHTML = "HTML,CSS,Javascript,Google User Authentication,Firebase,and AWS:(S3/Route53/API Gateway)";

      });

  } )
</script>