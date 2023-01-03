$(document).ready(function () {
    let itemArrLocal = localStorage.getItem("arrLike") ? JSON.parse(localStorage.getItem("arrLike")) : [];
    let dem = 0;
    itemArrLocal.map(item => {
        let className = `#like-${item}`
        $(className).addClass('text-primary');

    })
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    // Example starter JavaScript for disabling form submissions if there are invalid fields
    $("#sendMail").click(async function (e) {
        var forms = document.querySelectorAll('.needs-validation')
        if (forms[0].checkValidity() === false) {
            e.preventDefault()
            e.stopPropagation()
        } else {
            console.log('upload form success')

            // ----------------ajax--------------------
            let urlPath = window.location.pathname.split("/")[1];
            console.log(urlPath);
            e.preventDefault();// avoid to execute the actual submit of the form.
            var data = $("#sendMail").serialize();
            let domButton = document.getElementById(`buttonSubmit`);
            domButton.classList.add(`alert-form-success`);
            let inputName = document.getElementById(`name`);
            let inputEmail = document.getElementById(`email`);
            let inputComment = document.getElementById(`comment`);
            inputName.value = '';
            inputEmail.value = '';
            inputComment.value = '';
            $.ajax({

                type: "post",
                url: `admin/contact/submitForm`,
                dataType: "json",
                data: data,
                success: function (resolve) {
                   

                    $(`.alert-form-success`).notify(
                        "Updated",
                        { position: "top", className: "success" }
                    );
                },


            });
            Swal.fire(
                'Good job!',
                'You clicked the button!',
                'success'
            )
           
            // --------------ajax-----------------
        }
        
        // await Array.prototype.slice.call(forms)
        // .forEach(function (form) {
        //     form.addEventListener('submit', function (event) {
        //         if (!form.checkValidity()) {
        //             event.preventDefault()
        //             event.stopPropagation()
        //         } else {
        //             dem +=1;
        //             event.preventDefault()

        //         }
        //         form.classList.add('was-validated')

        //     }, false)
        // })

        

    })

    $('#banner2').owlCarousel({
        loop: true,
        margin: 50,

        responsiveClass: true,
        responsive: {
            0: {
                items: 1,
                nav: true
            },
            600: {
                items: 1,
                nav: true,
            },
            1000: {
                items: 2,

                loop: true,
            }
        }

    });
    $('#banner3').owlCarousel({
        loop: true,
        margin: 50,
        loop: true,
        responsiveClass: true,
        autoplay: true,
        responsive: {
            0: {
                items: 1,
                nav: true
            },
            600: {
                items: 1,
                nav: true,

            },
            1000: {
                items: 1,

                loop: true,
            }
        }

    });
    $('#banner4').owlCarousel({
        loop: true,
        margin: 20,

        responsiveClass: true,
        responsive: {
            0: {
                items: 1,
                nav: true
            },
            600: {
                items: 2,
                nav: true,
            },
            1000: {
                items: 3,

                loop: true,
            }
        }

    });


})
const likeNews = (id) => {
    let className = `#like-${id}`;
    let itemArrLocal = localStorage.getItem("arrLike") ? JSON.parse(localStorage.getItem("arrLike")) : [];
    let arrData = [];
    //check
    if (itemArrLocal.includes(id)) {
        $(className).removeClass('text-primary');


        arrData = itemArrLocal.filter(function (item) {
            return item !== id
        }
        )
    } else {
        $(className).addClass('text-primary');

        arrData = [...itemArrLocal, id]
    }
    localStorage.setItem("arrLike", JSON.stringify(arrData));

}

