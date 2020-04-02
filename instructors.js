const fs = require('fs');
const Intl = require('intl');

const data = require('./data.json');
const { age, date } = require('./utils');

// create
exports.post = function(req, res) {
    const keys = Object.keys(req.body);

    for(key of keys) {
        if(req.body[key] == "") {
            return res.send('Please, fill all fields"');
        }      
    }

    let { avatar_url, name, birth, gender, services } = req.body;

    console.log(birth);

    birth            = Date.parse(birth);
    const created_at = Date.now();
    const id         = Number(data.instructors.length + 1);

    data.instructors.push({
        id,  
        avatar_url,
        name,
        birth,
        gender,
        services,        
        created_at
    }); 

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err) {
        if(err) return res.sed("Write file error!");

        return res.redirect("instructors");
    });
}

// show
exports.show = function(req, res) {
    const { id } = req.params;

    const searchInstructor = data.instructors.find(function(instructor) {
        return instructor.id == id;
    });

    if(!searchInstructor) return res.send("Instructor not found!");

    const instructor = {
        ...searchInstructor,
        age: age(searchInstructor.birth),
        services: searchInstructor.services.split(","),
        created_at: new Intl.DateTimeFormat("pt-BR").format(searchInstructor.created_at),
    }

    return res.render("instructors/show", { instructor });
}

// edit
exports.edit = function(req, res) {
    const { id } = req.params;

    const searchInstructor = data.instructors.find(function(instructor) {
        return instructor.id == id;
    });

    if(!searchInstructor) return res.send("Instructor not found!");

    const instructor = {
        ...searchInstructor,
        birth: date(searchInstructor.birth)
    }

    return res.render('instructors/edit', { instructor });
}