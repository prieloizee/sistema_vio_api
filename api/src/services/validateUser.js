module.exports = function validateUser({cpf, email, password, name, data_nascimento}){
 
    if(!cpf || !email ||!password ||!name ||!data_nascimento){
        return{error: "Todos os campos devem ser preenchidos"};
    }
    if(isNaN(cpf)||cpf.length !==11){
        return {erro:"CPF inválido, Deve conter 11 dígitos numéricos"}
    }
    if(!email.includes("@")){
        return{error:"Email inválido. Deve conter @"};
    }
    return null; // se estiver tudo certo retorna nulo pra ignorar o if na userController
}