
class temp {

    static get_temp(){
        const path = require('path');
        const url = path.join(__dirname, './temp.json');

        const fs = require("fs");

        let data = fs.readFile(url, (err, data => {
            if (err) throw err
            // console.log(JSON.parse(data))
        }));

        return JSON.parse(data);
    }

    static set_temp(temp){
        const path = require('path');
        const url = path.join(__dirname, './temp.json');

        const fs = require("fs");

        let data = JSON.stringify(temp);

        fs.writeFile(url, data, (err => {
            if (err) throw err
            // console.log("written")
        }))
    }

    static get_year(){
        let temporal = temp.get_temp()
        return parseInt(temporal["actual_year"])
    }

    static get_business(){
        let temporal = temp.get_temp()
        return temporal["actual_business"]
    }

    static get_month(){
        let temporal = temp.get_temp()
        return temporal["actual_month"]
    }

    static set_year(year){
        let temporal = temp.get_temp()
        if (year == null){
            temporal["actual_year"] = ""
            temp.set_temp()
        }
        else{
            temporal["actual_year"] = year.toString()
            temp.set_temp(temporal)
        }
    }

    static set_business(business){
        let temporal = temp.get_temp()
        if (business == null){
            temporal["actual_business"] = ""
            temp.set_temp()
        }
        else{
            temporal["actual_business"] = business.toString()
            temp.set_temp(temporal)
        }
    }

    static set_month(month){
        let temporal = temp.get_temp()
        if (month == null){
            temporal["actual_month"] = ""
            temp.set_temp()
        }
        else{
            temporal["actual_month"] = month.toString()
            temp.set_temp(temporal)
        }
    }
}