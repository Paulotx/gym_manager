const fs = require('fs');
const Intl = require('intl');

const data = require('../data.json');
const { age, date } = require('../utils');


// index
exports.index = function(req, res) {
    return res.render("members/index", { members: data.members });
}

// create 
exports.create = function(req, res) {
    return res.render('members/create');
}

// post
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
    const id         = Number(data.members.length + 1);

    data.members.push({
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

        return res.redirect("members");
    });
}

// show
exports.show = function(req, res) {
    const { id } = req.params;

    const searchMember = data.members.find(function(member) {
        return member.id == id;
    });

    if(!searchMember) return res.send("Member not found!");

    const member = {
        ...searchMember,
        age: age(searchMember.birth),
    }

    return res.render("members/show", { member });
}

// edit
exports.edit = function(req, res) {
    const { id } = req.params;

    const searchMember = data.members.find(function(member) {
        return member.id == id;
    });

    if(!searchMember) return res.send("Member not found!");

    const member = {
        ...searchMember,
        birth: date(searchMember.birth)
    }

    return res.render('members/edit', { member });
}

// put
exports.put = function(req, res) {
    const { id } = req.body;

    let index = 0;

    const searchMember = data.members.find(function(member, searchIndex) {
        if(id == member.id) {
            index = searchIndex;
            return true;
        }
    });

    if(!searchMember) return res.send("Member not found!");

    const member = {
        ...searchMember,
        ...req.body,
        birth: Date.parse(req.body.birth),
        id: Number(req.body.id)
    }

    data.members[index] = member;

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err) {
        if(err) return res.send("Write error!");

        return res.redirect(`/members/${id}`);
    })
}

// delete
exports.delete = function(req, res) {
    const { id } = req.body;

    const filteredMembers = data.members.filter(function(member) {
        return member.id != id;
    });

    data.members = filteredMembers;

    fs.writeFile("data.json", JSON.stringify(data, null, 2,), function(err) {
        if(err) return res.send("Write error!");

        return res.redirect("/members");
    })
}