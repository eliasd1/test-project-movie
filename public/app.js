$('ul').hide();
$('#search').on('input', handleChange)
function handleChange(event){   
    if($(this).val() !== ''){
        $('ul').show();
        $.getJSON(`/searches?search=${$(this).val()}`).then(data =>{
        $('ul').html('');
        data.results = data.results.filter(result => result.poster_path);
        data.results.forEach(result => {
            $('ul').append(`<li>
                                <img src = 'https://image.tmdb.org/t/p/w500${result.poster_path}'>
                                <p>${result.original_title}<p>
                            </li>`)
        });
        if($(this).val() === ''){
            $('ul').html('');
            $('ul').hide();
        }
    }).catch(error => console.log('this error'));
    } else{
        $('ul').html(''); 
        $('ul').hide();
    }
}