var Vm;
function iniciar(){
    try{
        Vm= new Vue({
            el: '#app',
            data: {
                url_savne: 'https://www.savne.net/',
                source: {
                    horarios: horariosSource,
                },

                dias: [],
                cursos: [],
                profesores: [],

                dia: undefined,
                curso: undefined,
                profesor: undefined,

                resultados: [],

                dias_semana: ["Domingo", "Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado"]
            },
            methods:{
                obtener_dias: function(){
                    var nombre_dias= [];
                    $.each(_.groupBy(this.source.horarios, 'dia'), function(nombre_dia){
                        nombre_dias.push(nombre_dia);
                    });
                    return nombre_dias;
                },
                obtener_cursos: function(){
                    var nombre_cursos= [];
                    $.each(_.groupBy(this.source.horarios, 'curso'), function(nombre_curso){
                        nombre_cursos.push(nombre_curso);
                    });
                    return _.sortBy(nombre_cursos);
                },
                obtener_profesores: function(){
                    var nombre_profesores= [];
                    $.each(_.groupBy(this.source.horarios, 'profesor'), function(nombre_profesor){
                        nombre_profesores.push(nombre_profesor);
                    });
                    return _.sortBy(nombre_profesores);
                },

                aplicar_filtro: function(){
                    var where= {};
                    if(this.dia !== undefined){
                        where.dia= this.dia
                    }
                    if(this.curso !== undefined){
                        where.curso= this.curso
                    }
                    if(this.profesor !== undefined){
                        where.profesor= this.profesor
                    }
                    this.resultados= _.sortBy(_.where(Vm.source.horarios, where), 'hora');
                }

            },
            filters: {
                formatMoney: function (value) {
                    return accounting.formatMoney(value);
                },
                formatNumber: function (value) {
                    return accounting.formatNumber(value);
                },
                formatHour: function (hour) {
                    return '0'+hour+':00';
                }
            },
            watch: {
                dia: function(){
                    this.aplicar_filtro();
                },
                curso: function(){
                    this.aplicar_filtro();
                },
                profesor: function(){
                    this.aplicar_filtro();
                }
            },
            created: function(){
                accounting.settings = {
                    currency: {
                        symbol : "$",   // default currency symbol is '$'
                        format: "%s%v", // controls output: %s = symbol, %v = value/number (can be object: see below)
                        decimal : ",",  // decimal point separator
                        thousand: ".",  // thousands separator
                        precision : 2   // decimal places
                    },
                    number: {
                        precision : 0,  // default precision on numbers is 0
                        thousand: ".",
                        decimal : ","
                    }
                };
                this.dias= this.obtener_dias();
                this.cursos= this.obtener_cursos();
                this.profesores= this.obtener_profesores();

                var current_date = new Date();
                this.dia= this.dias_semana[current_date.getDay()];

            }
        });
    }
    catch(err) {
        alert('Error: '+err.message);
    }
}
$(document).ready(function(){
    iniciar();
});
