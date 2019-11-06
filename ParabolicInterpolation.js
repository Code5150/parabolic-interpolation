//Подключение алгоритма для решения СЛАУ методом Гаусса
const gaussianElimination = require("gaussian-elimination");

var interpolate = function(points){
    let systemOfEquations = [];
    let counter = 0; 
    //задаются уравнения вида
    //Ai*(Xi-1)^2 + Bi*(Xi-1) + Ci = Yi-1
    //Ai*(Xi)^2 + Bi*(Xi) + Ci = Yi
    //n точек дают n-1 сплайнов
    for(let i = 0; i < points.length - 1; i++){
        let eq = new Array((3*(points.length - 1)) + 1);
        for(let j = 0; j < eq.length; j++) eq[j] = 0;
        //console.log(eq);
        eq[counter] = points[`x${i+1}`] * points[`x${i+1}`];
        eq[counter+1] = points[`x${i+1}`];
        eq[counter+2] = 1;
        eq[eq.length - 1] = points[`y${i+1}`];
        systemOfEquations.push(eq);
        eq = new Array((3*(points.length - 1)) + 1);
        for(let j = 0; j < eq.length; j++) eq[j] = 0;
        eq[counter] = points[`x${i+2}`] * points[`x${i+2}`];
        eq[counter+1] = points[`x${i+2}`];
        eq[counter+2] = 1;
        eq[eq.length - 1] = points[`y${i+2}`];
        systemOfEquations.push(eq);
        counter+=3;
    }
    //Условие непрерывности первой производной
    //2*Ai*Xi + Bi = 2*Ai+1*Xi+1 + Bi+1
    counter = 0;
    for(let i = 1; i <= points.length - 2; i++){
        let eq = new Array((3*(points.length - 1)) + 1);
        for(let j = 0; j < eq.length; j++) eq[j] = 0;
        eq[counter] = 2*points[`x${i+1}`];
        eq[counter+1] = 1;
        eq[counter+3] = -2*points[`x${i+1}`];
        eq[counter+4] = -1;
        systemOfEquations.push(eq);
        counter+=3;
    }
    //Граничное условие
    counter = 0;
    let eq = new Array((3*(points.length - 1)) + 1);
    for(let j = 0; j < eq.length; j++) eq[j] = 0;
    switch(points.condition){
        case 'firstDer':
            eq[counter] = 2*points[`x2`];
            eq[counter+1] = 1;
            eq[eq.length - 1] = (points[`y2`] - points[`y1`])/(points[`x2`] - points[`x1`]);
            break;
        case 'lastDer':
            eq[eq.length - 4] = 2*points[`x${points.length}`];
            eq[eq.length - 3] = 1;
            eq[eq.length - 1] = (points[`y${points.length}`] - points[`y${points.length - 1}`])/
                                (points[`x${points.length}`] - points[`x${points.length - 1}`]);
            break;
    }
    systemOfEquations.push(eq);
    //Тестовый вывод
    //console.log(systemOfEquations);
    let result = gaussianElimination(systemOfEquations);
    result = result.map(value => Math.round(value*100)/100); 
    //Преобразование к виду {ai: m, bi: n, ci: k, ...}
    let paramList = {};
    counter = 1;
    for(let i = 0; i < result.length; i+= 3){
        paramList[`a${counter}`] = result[i];
        paramList[`b${counter}`] = result[i+1];
        paramList[`c${counter}`] = result[i+2];
        counter++;
    }
    return paramList;
}

module.exports.interpolate = interpolate;


