import React from "react";
import { ScrollView, StyleSheet } from "react-native";
import { Text } from "@/components/Themed";
import { Colors } from "@/constants/colors";

const styles = StyleSheet.create({
  boldItem: {
    fontWeight: "bold",
  },
  container: {
    backgroundColor: Colors.light.background,
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 60,
  },
  paragraph: {
    color: Colors.light.text,
    fontSize: 13.33,
    lineHeight: 22,
    marginBottom: 6,
    textAlign: "justify",
  },
  sectionTitle: {
    color: Colors.light.russianViolet,
    fontSize: 23.03,
    fontWeight: "bold",
    marginBottom: 6,
    marginTop: 12,
  },
  subsectionTitle: {
    color: Colors.light.text,
    fontSize: 16,
    fontWeight: "500",
  },
  subtitle: {
    color: Colors.light.jet,
    fontSize: 16,
    marginBottom: 16,
  },
  title: {
    color: Colors.light.majorelleBlue,
    fontSize: 27.64,
    fontWeight: "bold",
    marginBottom: 4,
  },
  topics: {
    color: Colors.light.text,
    fontSize: 13.33,
    lineHeight: 22,
    marginBottom: 6,
    textAlign: "left",
  },
});

export default function TermsScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>
        Política de Privacidade – Plataforma Gamix
      </Text>
      <Text style={styles.subtitle}>
        Última atualização: 13 de junho de 2025
      </Text>

      <Text style={styles.paragraph}>
        Bem-vindo à Gamix! {"\n"}
        Esta Política de Privacidade tem o objetivo de informar de forma
        transparente como coletamos, utilizamos, armazenamos, protegemos e
        compartilhamos os seus dados pessoais. Ao utilizar a plataforma, você
        concorda com os termos aqui estabelecidos, que estão em total
        conformidade com a Lei Geral de Proteção de Dados Pessoais – LGPD (Lei
        nº 13.709/2018) e demais normas aplicáveis. (LGPD).
      </Text>

      <Text style={styles.sectionTitle}>1. Definições</Text>
      <Text style={styles.paragraph}>
        Para fins desta Política, aplicam-se as seguintes definições:
      </Text>
      <Text style={styles.topics}>
        • <Text style={styles.boldItem}>Dados Pessoais:</Text> informações que
        permitem identificar ou tornar identificável uma pessoa física, como
        nome, e-mail, CPF, localização, entre outros.{"\n"}•{" "}
        <Text style={styles.boldItem}>Dados Sensíveis:</Text> dados pessoais
        sobre origem racial, convicção religiosa, opinião política, saúde,
        orientação sexual, biometria ou dados genéticos.{"\n"}•{" "}
        <Text style={styles.boldItem}>Usuário:</Text> qualquer pessoa que
        utiliza a plataforma Gamix.{"\n"}•{" "}
        <Text style={styles.boldItem}>Controlador:</Text> a pessoa natural ou
        jurídica que toma as decisões sobre o tratamento de dados pessoais –
        neste caso, a equipe gestora da Gamix.{"\n"}•{" "}
        <Text style={styles.boldItem}>Operador:</Text> a pessoa natural ou
        jurídica que realiza o tratamento de dados pessoais em nome do
        controlador.{"\n"}• <Text style={styles.boldItem}>Base Legal:</Text>{" "}
        fundamento jurídico que autoriza o tratamento de dados, como
        consentimento, execução de contrato, cumprimento de obrigação legal,
        entre outros.
      </Text>

      <Text style={styles.sectionTitle}>2. Coleta de Dados</Text>
      <Text style={styles.subsectionTitle}>Dados fornecidos pelo usuário:</Text>
      <Text style={styles.topics}>
        • Nome completo{"\n"}• Nome de exibição (username){"\n"}• E-mail{"\n"}•
        Senha (armazenada de forma criptografada){"\n"}• Foto ou ícone de perfil
        (opcional){"\n"}• Conteúdo publicado (textos, vídeos, imagens, links,
        códigos){"\n"}• Portfólio profissional e descrições técnicas{"\n"}
      </Text>

      <Text style={styles.subsectionTitle}>
        Dados coletados automaticamente:
      </Text>
      <Text style={styles.topics}>
        • Endereço IP{"\n"}• Tipo de dispositivo e navegador{"\n"}• Informações
        de navegação e interações na plataforma (Google Analytics e Microsoft
        Clarity){"\n"}• Dados de localização aproximada (quando autorizados)
      </Text>

      <Text style={styles.sectionTitle}>3. Uso dos Dados</Text>
      <Text style={styles.paragraph}>
        Os dados pessoais são utilizados para as seguintes finalidades:
      </Text>
      <Text style={styles.topics}>
        • Criar e manter o perfil do usuário na plataforma{"\n"}• Permitir
        acesso e uso das funcionalidades (como postagens, comentários e
        feedbacks){"\n"}• Proporcionar conexões entre usuários com perfis
        complementares{"\n"}• Realizar sugestões de colaboração baseadas em
        interesses e interações{"\n"}• Avaliar o desempenho de projetos e grupos
        (relatórios de produtividade){"\n"}• Exibir conteúdos em destaque e
        realizar divulgação interna{"\n"}• Promover comunicações relacionadas à
        plataforma, notificações técnicas e novidades{"\n"}• Aprimorar a
        segurança da aplicação, prevenindo fraudes e acessos não autorizados
      </Text>

      <Text style={styles.sectionTitle}>4. Compartilhamento</Text>
      <Text style={styles.paragraph}>
        A Gamix não vende nem compartilha os dados dos usuários com terceiros
        para fins comerciais externos. O compartilhamento de dados poderá
        ocorrer nos seguintes casos, sempre com base legal:
      </Text>
      <Text style={styles.topics}>
        • Prestadores de serviço (como serviços de hospedagem e armazenamento em
        nuvem){"\n"}• Parceiros técnicos para viabilizar funcionalidades
        específicas{"\n"}• Cumprimento de obrigação legal ou judicial, mediante
        ordem de autoridade competente{"\n"}• Análises estatísticas e
        relatórios, desde que anonimizados
      </Text>
      <Text style={styles.paragraph}>
        A eventual transferência internacional de dados ocorrerá apenas para
        países com grau de proteção compatível com a LGPD, mediante garantias
        adequadas.
      </Text>

      <Text style={styles.sectionTitle}>5. Armazenamento e Segurança</Text>
      <Text style={styles.paragraph}>
        Adotamos medidas rigorosas para proteger os dados pessoais armazenados:
      </Text>
      <Text style={styles.topics}>
        • Armazenamento em servidores com monitoramento, backup e replicação em
        zonas seguras{"\n"}• Hospedagem com provedores especializados e
        infraestrutura em nuvem{"\n"}• Criptografia de senhas{"\n"}• Comunicação
        entre cliente e servidor protegida por HTTPS{"\n"}• Autenticação com
        verificação de permissões{"\n"}• Políticas de acesso com privilégio
        mínimo (least privilege){"\n"}• Prevenção contra CSRF, XSS, injeções e
        ataques de força bruta{"\n"}• Atualizações automáticas do sistema de
        segurança{"\n"}
      </Text>

      <Text style={styles.sectionTitle}>6. Direitos do Usuário</Text>
      <Text style={styles.paragraph}>
        De acordo com a LGPD, você possui os seguintes direitos em relação aos
        seus dados:
      </Text>
      <Text style={styles.topics}>
        • Confirmação e acesso aos dados tratados pela plataforma{"\n"}•
        Correção de dados incompletos, inexatos ou desatualizados{"\n"}•
        Anonimização, bloqueio ou eliminação de dados desnecessários ou
        excessivos{"\n"}• Portabilidade dos dados para outro fornecedor de
        serviço{"\n"}• Revogação do consentimento, quando aplicável{"\n"}•
        Eliminação dos dados pessoais tratados com base no consentimento{"\n"}•
        Informação sobre as entidades com as quais os dados foram compartilhados
        {"\n"}• Revisão de decisões automatizadas, quando houver
      </Text>
      <Text style={styles.paragraph}>
        Esses direitos podem ser exercidos mediante solicitação por e-mail:
        gamix-privacidade@gmail.com
      </Text>

      <Text style={styles.sectionTitle}>7. Cookies</Text>
      <Text style={styles.paragraph}>
        A Gamix utiliza cookies e tecnologias de rastreamento para:
      </Text>
      <Text style={styles.topics}>
        • Autenticar o usuário{"\n"}• Registrar preferências{"\n"}• Medir
        estatísticas de navegação e engajamento{"\n"}• Personalizar conteúdos e
        recomendações
      </Text>
      <Text style={styles.paragraph}>
        O usuário pode, a qualquer momento, configurar seu navegador para
        bloquear cookies ou alertar quando estiverem sendo utilizados. No
        entanto, isso pode comprometer a funcionalidade de certas partes da
        plataforma.
      </Text>

      <Text style={styles.sectionTitle}>8. Atualizações</Text>
      <Text style={styles.paragraph}>
        A presente Política poderá ser atualizada periodicamente, a fim de
        refletir alterações na legislação, melhorias da plataforma ou ajustes
        operacionais.{"\n"}
        Em caso de mudanças substanciais, os usuários serão avisados por meio de
        notificações no aplicativo ou pelo e-mail cadastrado. O uso continuado
        da Gamix após tais alterações será considerado como aceitação tácita.
      </Text>

      <Text style={styles.sectionTitle}>9. Contato</Text>
      <Text style={styles.paragraph}>
        Para qualquer dúvida, solicitação ou exercício de direitos relacionados
        a esta Política, entre em contato:{"\n"}
        📧 gamix-privacidade@gmail.com
      </Text>

      <Text style={styles.paragraph}>
        A Gamix reafirma seu compromisso com a ética digital, a segurança da
        informação e a privacidade de seus usuários, promovendo um ambiente
        colaborativo, transparente e seguro para todos os participantes da
        comunidade de desenvolvimento de jogos.{"\n"}
        Agradecemos por fazer parte da comunidade Gamix!
      </Text>
    </ScrollView>
  );
}
