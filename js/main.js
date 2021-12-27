
let btn = $('.btn')
let mainBtn = $('.main-btn')
let inp = $('.lastname-inp')
let name = $('.name-inp')
let phone = $('.phone-inp')
let kpi1 = $('.first-inp')
let kpi2 = $('.second-inp')
let kpi3 = $('.third-inp')
let kpi4 = $('.fourth-inp')
let table = $('.table-list')

// let month = (kpi1+kpi2+kpi3+kpi4)


mainBtn.on('click',function(){
    let value = inp.val()
    let name1 = name.val()
    let phone1 = phone.val()
    let week1 = kpi1.val()
    let week2 = kpi2.val()
    let week3 = kpi3.val()
    let week4 = kpi4.val()

    // ! пустое поле не может быть отправлено
    if(!value.trim()){  // ! trim() удаляет пробелы
        alert('Заполните поле')
        return
    }
    let newTask = {
        task: value,
        name: name1,
        phone: phone1,
        kpi1: week1,
        kpi2: week2,
        kpi3: week3,
        kpi4: week4,

    }
    postNewTask(newTask)
    // !  очищение инпута 
    inp.val('')
    name.val('')
    phone.val('')
    kpi1.val('')
    kpi2.val('')
    kpi3.val('')
    kpi4.val('')
})

// !функция для постинга

function postNewTask(task){
    fetch('http://localhost:8000/todos',{
        method: 'POST',
        body: JSON.stringify(task),
        headers: {
            'Content-Type': 'application/json;charser=utf-8'
        }
        // ! обновляет страницу после добавления
    }).then(()=>render())
}

// ! рендерим
let page=1

async function render(){
    let res = await fetch(`http://localhost:8000/todos?_page=${page}&_limit=7`) //! подожди пока функция сработает
    let data = await res.json() //! тоже самое что и 85 строка заменили then-ы
        // .then(response => response.json())
        // .then(data=>{
            // ! очищение для того чтобы добавлять только последний элемент в HTML
            table.html(`<tr>
            <th>Surname</th>
            <th>Name</th>
            <th>Phone number</th>
            <th>Week 1</th>
            <th>Week 2</th>
            <th>Week 3</th>
            <th>Week 4</th>
            <th>Month</th>
            <th></th>
            <th></th>
        </tr>`)
            data.forEach(item => {
                table.append(`<tr id=${item.id}>
                <td>${item.task}</td> 
                <td>${item.name}</td>
                <td>${item.phone}</td>
                <td>${item.kpi1}</td>
                <td>${item.kpi2}</td>
                <td>${item.kpi3}</td>
                <td>${item.kpi4}</td>
                <td>${(item.kpi1/4)+(item.kpi2/4)+(item.kpi3/4)+(item.kpi4)/4}</td>
                <td><button class ="btn-delete">Delete</button></td>
                <td><button class ="btn-update"  data-bs-toggle="modal" data-bs-target="#exampleModal" >Update</button></td>
                </tr>`)
                
            });             //! при создании таска дается id  которая хранится в item
                                            //! ^ добавляем кнопку Delete 
                                            if(page <= 1){
                                                $('#previous-btn').css('display', 'none')
                                            }else($('#previous-btn').css('display', 'block'))
}



// ! DELETing

$('body').on('click', '.btn-delete', function(event){
    // console.log('delete'); //!   проверяем отлавливает ли событие нажатие кнопки 
    let id = event.target.parentNode.parentNode.id; //! получили id, затем обернули в переменную id
    fetch(`http://localhost:8000/todos/${id}`,{
        method: 'DELETE'
    })
    .then(()=>render()) //! добавляем рендер чтобы страница обновлялась после удаления тасков
})
render()




// !UPDATING
async function getDetailData(id){
    let res = await fetch(`http://localhost:8000/todos/${id}`)
    let data = await res.json()
    return data
}
getDetailData()

$('body').on('click', '.btn-update', async function(e){
    let id = e.target.parentNode.parentNode.id
    let data = await getDetailData(id)
    
    console.log(inp)
    inp.val(data.value)
    name.val(data.name1)
    phone.val(data.phone1)
    kpi1.val(data.week1)
    kpi2.val(data.week2)
    kpi3.val(data.week3)
    kpi4.val(data.week4)
    $('.edit-btn').attr('id', data.id)
})

$('body').on('click', '.edit-btn', async function(e){
    let id = e.target.id
    let editTask = {
        task: value.val(),
        name: name1.val(),
        phone: phone1.val(),
        kpi1: week1.val(),
        kpi2: week2.val(),
        kpi3: week3.val(),
        kpi4: week4.val()
    }

    inp.val('')
    name.val('')
    phone.val('')
    kpi1.val('')
    kpi2.val('')
    kpi3.val('')
    kpi4.val('')

    await fetch(`http://localhost:8000/todos/${id}`, {
        method: 'PUT',
        body: JSON.stringify(editTask),
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        }
    })
        .then(() => render())
})
//! end updating



// ! pagination
$('#next-btn').on('click', (e)=>{
    page++
    render()
})

$('#previous-btn').on('click', (e)=>{
    page--
    render()
})

render()