

const button2 = document.querySelector(".btn2").addEventListener("click", () => {

    fetch('/clicked1', {method: 'POST'})
    .then(function(response) {
        if(response.ok) {
            return;
        }
        throw new Error("Request Failed");
    })
    .catch(function(error) {
        console.log("error");
    });

    location.replace(location.href);
});

