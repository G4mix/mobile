import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Text } from "@/components/Themed";
import { Colors } from '@/constants/colors';

const styles = StyleSheet.create({
  boldItem: {
    fontWeight: 'bold',
  },
  container: {
    backgroundColor: Colors.light.background,
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 80,
  },
  paragraph: {
    color: Colors.light.text,
    fontSize: 13.33,
    lineHeight: 22,
    marginBottom: 6,
    textAlign: 'justify',
  },
  sectionTitle: {
    color: Colors.light.russianViolet,
    fontSize: 23.03,
    fontWeight: 'bold',
    marginBottom: 6,
    marginTop: 12,
  },
  subsectionTitle: {
    color: Colors.light.text,
    fontSize: 16,
    fontWeight: '500',
  },
  subtitle: {
    color: Colors.light.jet,
    fontSize: 16,
    marginBottom: 16,
  },
  title: {
    color: Colors.light.majorelleBlue,
    fontSize: 27.64,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  topics:{
    color: Colors.light.text,
    fontSize: 13.33,
    lineHeight: 22,
    marginBottom: 6,
    textAlign: 'left',
  },
});

export default function TermsScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Termos de Uso – Plataforma Gamix</Text>
      <Text style={styles.subtitle}>Última atualização: 23 de junho de 2025</Text>

      <Text style={styles.paragraph}>
        Bem-vindo à Gamix! Estes Termos de Uso regem o acesso e a utilização da nossa plataforma
        online voltada à comunidade de desenvolvedores de jogos, artistas, sound designers, investidores
        e entusiastas do setor. Ao utilizar a Gamix, você concorda com todos os termos e condições aqui descritos.
      </Text>
      <Text style={styles.paragraph}>
        Este documento tem por finalidade proteger os direitos do desenvolvedor e garantir uma experiência segura, colaborativa e produtiva para todos os usuários.
      </Text>

      <Text style={styles.sectionTitle}>1. Definições</Text>
      <Text style={styles.paragraph}>
        Para fins deste documento, consideram-se as seguintes definições:
      </Text>
      <Text style={styles.topics}>
        • <Text style={styles.boldItem}>Gamix:</Text> plataforma digital colaborativa para criação, divulgação e desenvolvimento de jogos.{"\n"}
        • <Text style={styles.boldItem}>Usuário:</Text> toda pessoa física ou jurídica que acessa e utiliza os serviços oferecidos.{"\n"}
        • <Text style={styles.boldItem}>Conteúdo:</Text> toda informação publicada pelo usuário, como textos, imagens, vídeos e códigos.{"\n"}
        • <Text style={styles.boldItem}>Serviço:</Text> funcionalidades como criação de postagens, portfólios, grupos, etc.{"\n"}
        • <Text style={styles.boldItem}>Administrador:</Text> responsável técnico e jurídico da plataforma.
      </Text>

      <Text style={styles.sectionTitle}>2. Uso da Plataforma</Text>
      <Text style={styles.subsectionTitle}>2.1. Cadastro e Acesso</Text>
      <Text style={styles.topics}>
        • O acesso à Gamix exige o cadastro do usuário, mediante fornecimento de informações verídicas.{"\n"}
        • Usuários com menos de 18 anos devem utilizar a plataforma com autorização de seus responsáveis legais.
      </Text>

      <Text style={styles.subsectionTitle}>2.2. Permissões e Restrições</Text>
      <Text style={styles.paragraph}>
        É vedado aos usuários:
      </Text>
      <Text style={styles.topics}>
        • Publicar conteúdos ofensivos, discriminatórios, ilegais ou que incitem ódio ou violência.{"\n"}
        • Usar a plataforma para fins fraudulentos, ilícitos ou que infrinjam direitos de terceiros.{"\n"}
        • Compartilhar dados de terceiros sem autorização legal expressa.{"\n"}
        • Praticar engenharia reversa, tentativa de invasão ou uso indevido do sistema.
      </Text>
      <Text style={styles.paragraph}>
        O descumprimento de qualquer regra poderá resultar na suspensão ou exclusão da conta, sem prejuízo das medidas judiciais cabíveis.
      </Text>

      <Text style={styles.sectionTitle}>3. Direitos e Obrigações</Text>
      <Text style={styles.subsectionTitle}>3.1. Do Usuário</Text>
      <Text style={styles.paragraph}>
        O usuário se compromete a:
      </Text>
      <Text style={styles.topics}>
        • Utilizar a Gamix com respeito à comunidade e à legislação vigente;{"\n"}
        • Manter seus dados atualizados;{"\n"}
        • Responder pelo conteúdo que publicar e pelas interações realizadas na plataforma.
      </Text>

      <Text style={styles.subsectionTitle}>3.2. Da Plataforma</Text>
      <Text style={styles.paragraph}>
        A Gamix compromete-se a:
      </Text>
      <Text style={styles.topics}>
        • Prover um ambiente estável, seguro e funcional;{"\n"}
        • Adotar medidas de segurança para proteção de dados e acesso;{"\n"}
        • Mediar, quando necessário, conflitos entre usuários dentro dos limites legais e técnicos.
      </Text>

      <Text style={styles.sectionTitle}>4. Propriedade Intelectual</Text>
      <Text style={styles.topics}>
        • Todo o conteúdo criado por usuários pertence exclusivamente a seus autores.{"\n"}
        • O usuário concede à Gamix uma licença não exclusiva, mundial e gratuita para exibição e promoção do conteúdo na plataforma, inclusive em áreas de destaque.{"\n"}
        • A identidade visual, marca, logotipo, layout e código da plataforma Gamix são de propriedade exclusiva dos seus desenvolvedores, sendo vedado seu uso sem autorização expressa.
      </Text>

      <Text style={styles.sectionTitle}>5. Privacidade e Proteção de Dados</Text>
      <Text style={styles.paragraph}>
        A Gamix trata os dados pessoais conforme a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018). Os principais pontos incluem:
      </Text>
      <Text style={styles.topics}>
        • Coleta de dados como nome, e-mail, dados de login e atividades na plataforma.{"\n"}
        • Armazenamento seguro e criptografado para os dados.{"\n"}
        • Compartilhamento apenas com parceiros essenciais (ex: serviços de nuvem).{"\n"}
        • Os dados não serão vendidos, divulgados ou transferidos sem consentimento, salvo por obrigação legal.
      </Text>
      <Text style={styles.paragraph}>
        A qualquer momento, o usuário poderá solicitar a remoção, edição ou portabilidade de seus dados pessoais, conforme previsto na LGPD.
      </Text>
      <Text style={styles.sectionTitle}>6. Limitações de Responsabilidade</Text>
      <Text style={styles.paragraph}>
        A Gamix não se responsabiliza por:
      </Text>
      <Text style={styles.topics}>
        • Conteúdo publicado pelos usuários;{"\n"}
        • Perdas decorrentes de indisponibilidade temporária da plataforma;{"\n"}
        • Danos causados por terceiros ou por uso indevido da conta do usuário;{"\n"}
        • Contratos firmados entre usuários fora da plataforma.{"\n"}
      </Text>
      <Text style={styles.paragraph}>
        A equipe da Gamix trabalha continuamente para manter a segurança, integridade e qualidade do serviço, mas não garante funcionamento ininterrupto ou isento de falhas técnicas.
      </Text>

      <Text style={styles.sectionTitle}>7. Encerramento e Atualizações</Text>
      <Text style={styles.subsectionTitle}>7.1. Encerramento de Conta</Text>
      <Text style={styles.paragraph}>
        O usuário pode solicitar a exclusão de sua conta a qualquer momento. A Gamix reserva-se o direito de encerrar contas inativas ou que violem estes Termos de Uso, mediante notificação prévia, salvo em casos de infrações graves.
      </Text>

      <Text style={styles.subsectionTitle}>7.2. Atualizações dos Termos</Text>
      <Text style={styles.paragraph}>
        Este documento poderá ser alterado a qualquer momento. Em caso de mudanças relevantes, os usuários serão notificados com antecedência razoável. O uso contínuo da plataforma após a notificação implicará aceitação das novas condições.
      </Text>

      <Text style={styles.sectionTitle}>8. Disposições Gerais</Text>
      <Text style={styles.topics}>
        • <Text style={styles.boldItem}>Legislação Aplicável:</Text> Este contrato é regido pelas leis da República Federativa do Brasil.{"\n"}
        • <Text style={styles.boldItem}>Validade:</Text> Caso alguma disposição seja considerada inválida ou inexequível, as demais continuarão em pleno vigor.{"\n"}
        • <Text style={styles.boldItem}>Comunicações:</Text> Todas as comunicações serão realizadas por meio do e-mail cadastrado pelo usuário ou por avisos no aplicativo.
      </Text>

      <Text style={styles.paragraph}>
        Para dúvidas ou sugestões, entre em contato pelo e-mail: gamix-contato@gmail.com
      </Text>

      <Text style={styles.paragraph}>Obrigado por fazer parte da comunidade Gamix!</Text>
    </ScrollView>
  );
}
