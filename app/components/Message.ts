export abstract class Message {
    static successMsg: string = 'Sucesso!';
    static errorMsg: string = 'Erro!';
    static successSave: string = 'Registro salvo com sucesso.';
    static errorSave: string = 'Erro ao salvar o registro.';
    static successDelete: string = 'Registro deletado com sucesso.';
    static errorDelete: string = 'Erro ao deletar o registro.';
    static successUpload: string = 'Sucesso ao enviar o arquivo.';
    static errorUpload: string = 'Erro ao enviar o arquivo.';
    static errorLoad: string = 'Erro ao carregar os registros.';

    static empty: string = 'Nenhum registro encontrado.';
    static currentPageReportTemplate: string = 'Exibindo {first} de {last} no total de {totalRecords} registros.';

    static expiredSession: string = 'Sessão expirada, saia e entre novamente';
}
