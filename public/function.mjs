
var input1Value;
var input2Value;

const button1 = document.querySelector(".btn1").addEventListener("click", () => {
    
    const input1 = document.querySelector("#floatingInput");
    input1Value = input1.value;

    const input2 = document.querySelector("#floatingPassword");
    input2Value = input2.value;

    fetch('/clicked', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ input1Value, input2Value })
    })

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


