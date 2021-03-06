$('#searchMenu').hide();
// $('.sign-up-form').hide();

$('#search').on('input', handleChange)
$('.nav-right').on('click', handleClick)

function handleChange(event){   
    if($(this).val() !== ''){
        $('#searchMenu').show();
        $.getJSON(`/searches?search=${$(this).val()}`).then(data =>{
        $('#searchMenu').html('');
        data.results = data.results.filter(result => result.poster_path);
        data.results.forEach(result => {
            $('#searchMenu').append(`<li>
                                <img src = 'https://image.tmdb.org/t/p/w500${result.poster_path}'>
                                <p>${result.original_title}<p>
                            </li>`)
        });
        if($(this).val() === ''){
            $('#searchMenu').html('');
            $('#searchMenu').hide();
        }
    }).catch(error => console.log('this error'));
    } else{
        $('#searchMenu').html(''); 
        $('#searchMenu').hide();
    }
}

// function handleClick(event){
//     if(event.target !== this){
//         if(event.target.textContent === 'Sign Up'){
//             console.log('sign up')
//         } else{
//             console.log('log in')
//         }
//     }
// }