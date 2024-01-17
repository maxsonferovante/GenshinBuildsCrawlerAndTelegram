export default class DiaDaSemana {
    /**
        * Returns the current day of the week in Portuguese.
        *
        * @returns {string} The current day of the week in Portuguese.
        *
        * @example
        * const diaDaSemana = new DiaDaSemana();
        * const diaAtual = diaDaSemana.obterDiaAtual();
        * console.log(diaAtual); // Output: "Segunda-feira" (if today is Monday)
        */
    static obterDiaAtual() {
        const diasDaSemana = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
        const dataAtual = new Date();
        const dia = dataAtual.getDay(); // 0 para Domingo, 1 para Segunda-feira, ...

        return diasDaSemana[dia];
    }
    /**
     * Returns the name of the day before the current day in Portuguese.
     * 
     * @returns {string} The name of the day before the current day.
     */
    static obterDiaAnterior() {
        const diasDaSemana = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
        const dataAtual = new Date();
        const dia = dataAtual.getDay(); // 0 para Domingo, 1 para Segunda-feira, ...

        return diasDaSemana[dia - 1];
    }

    /**
     * Returns the name of the day after the current day in Portuguese.
     * 
     * @returns {string} The name of the day after the current day.
     */
    static obterDiaPosterior() {
        const diasDaSemana = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
        const dataAtual = new Date();
        const dia = dataAtual.getDay(); // 0 para Domingo, 1 para Segunda-feira, ...

        return diasDaSemana[dia + 1];
    }

    static obterDataAtualComDiaDaSemana() {
        const dataAtual = new Date();
        const dia = dataAtual.getDay(); // 0 para Domingo, 1 para Segunda-feira, ...
        const diaDaSemana = this.obterDiaAtual();
        const diaMesAno = dataAtual.toLocaleDateString('pt-BR');

        return `${diaDaSemana} - ${diaMesAno}`;
    }
}



