/**
 * Serviço de Email - Sistema de Gestão de Milhas
 * 
 * Serviço responsável pelo envio de emails do sistema,
 * incluindo verificação de conta, recuperação de senha e notificações.
 * 
 * @author Especialista em Sistemas
 * @version 1.0.0
 */

const nodemailer = require('nodemailer');
const path = require('path');

class EmailService {
  constructor() {
    this.transporter = null;
    this.emailEnabled = String(process.env.EMAIL_ENABLED || '').toLowerCase() !== 'false';
    if (this.emailEnabled) {
      this.initializeTransporter();
    } else {
      console.log('✉️ Email desabilitado (EMAIL_ENABLED=false).');
    }
  }

  /**
   * Inicializar o transporter de email
   */
  initializeTransporter() {
    try {
      if (!this.emailEnabled) return;
      this.transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE || 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        },
        tls: {
          rejectUnauthorized: false
        }
      });

      // Verificar conexão
      this.transporter.verify((error, success) => {
        if (error) {
          console.error('❌ Erro na configuração do email:', error);
        } else {
          console.log('✅ Serviço de email configurado com sucesso');
        }
      });
    } catch (error) {
      console.error('❌ Erro ao inicializar serviço de email:', error);
    }
  }

  /**
   * Enviar email de verificação
   */
  async sendVerificationEmail(email, token) {
    if (!this.emailEnabled) return;
    const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verificar-email?token=${token}`;
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: email,
      subject: 'Verifique sua conta - Sistema de Gestão de Milhas',
      html: `
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verificação de Email</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #3B82F6; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
            .button { display: inline-block; background: #3B82F6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🚀 Sistema de Gestão de Milhas</h1>
            </div>
            <div class="content">
              <h2>Verifique seu email</h2>
              <p>Olá!</p>
              <p>Obrigado por se cadastrar no nosso sistema de gestão de milhas. Para ativar sua conta, clique no botão abaixo:</p>
              <a href="${verificationUrl}" class="button">Verificar Email</a>
              <p>Ou copie e cole este link no seu navegador:</p>
              <p><a href="${verificationUrl}">${verificationUrl}</a></p>
              <p>Este link expira em 24 horas.</p>
              <p>Se você não se cadastrou neste sistema, pode ignorar este email.</p>
              <p>Atenciosamente,<br>Equipe do Sistema de Gestão de Milhas</p>
            </div>
            <div class="footer">
              <p>Este é um email automático, não responda.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    return await this.sendEmail(mailOptions);
  }

  /**
   * Enviar email de recuperação de senha
   */
  async sendPasswordResetEmail(email, token) {
    if (!this.emailEnabled) return;
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/redefinir-senha?token=${token}`;
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: email,
      subject: 'Recuperação de Senha - Sistema de Gestão de Milhas',
      html: `
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Recuperação de Senha</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #EF4444; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
            .button { display: inline-block; background: #EF4444; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
            .warning { background: #FEF2F2; border: 1px solid #FECACA; padding: 15px; border-radius: 6px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔐 Recuperação de Senha</h1>
            </div>
            <div class="content">
              <h2>Redefinir sua senha</h2>
              <p>Olá!</p>
              <p>Recebemos uma solicitação para redefinir a senha da sua conta no Sistema de Gestão de Milhas.</p>
              <a href="${resetUrl}" class="button">Redefinir Senha</a>
              <p>Ou copie e cole este link no seu navegador:</p>
              <p><a href="${resetUrl}">${resetUrl}</a></p>
              <div class="warning">
                <p><strong>⚠️ Importante:</strong></p>
                <ul>
                  <li>Este link expira em 10 minutos</li>
                  <li>Se você não solicitou esta recuperação, ignore este email</li>
                  <li>Não compartilhe este link com ninguém</li>
                </ul>
              </div>
              <p>Se você não solicitou a recuperação de senha, pode ignorar este email com segurança.</p>
              <p>Atenciosamente,<br>Equipe do Sistema de Gestão de Milhas</p>
            </div>
            <div class="footer">
              <p>Este é um email automático, não responda.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    return await this.sendEmail(mailOptions);
  }

  /**
   * Enviar email de notificação
   */
  async sendNotificationEmail(email, subject, message, type = 'info') {
    if (!this.emailEnabled) return;
    const colors = {
      info: '#3B82F6',
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444'
    };

    const icons = {
      info: 'ℹ️',
      success: '✅',
      warning: '⚠️',
      error: '❌'
    };

    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to: email,
      subject: `${icons[type]} ${subject}`,
      html: `
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Notificação</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: ${colors[type]}; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>${icons[type]} ${subject}</h1>
            </div>
            <div class="content">
              ${message}
              <p>Atenciosamente,<br>Equipe do Sistema de Gestão de Milhas</p>
            </div>
            <div class="footer">
              <p>Este é um email automático, não responda.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    return await this.sendEmail(mailOptions);
  }

  /**
   * Enviar email de alerta de expiração
   */
  async sendExpirationAlert(email, accountName, expiringPoints, expirationDate) {
    const message = `
      <h2>Pontos Expirando!</h2>
      <p>Olá!</p>
      <p>Seus pontos na conta <strong>${accountName}</strong> estão próximos da expiração:</p>
      <ul>
        <li><strong>Quantidade:</strong> ${expiringPoints.toLocaleString('pt-BR')} pontos</li>
        <li><strong>Data de expiração:</strong> ${new Date(expirationDate).toLocaleDateString('pt-BR')}</li>
      </ul>
      <p>Não perca seus pontos! Acesse sua conta e faça bom uso deles.</p>
    `;

    return await this.sendNotificationEmail(
      email,
      'Pontos Expirando',
      message,
      'warning'
    );
  }

  /**
   * Enviar email de alerta de saldo baixo
   */
  async sendLowBalanceAlert(email, accountName, currentBalance, minBalance) {
    const message = `
      <h2>Saldo Baixo!</h2>
      <p>Olá!</p>
      <p>A conta <strong>${accountName}</strong> está com saldo baixo:</p>
      <ul>
        <li><strong>Saldo atual:</strong> ${currentBalance.toLocaleString('pt-BR')} pontos</li>
        <li><strong>Saldo mínimo configurado:</strong> ${minBalance.toLocaleString('pt-BR')} pontos</li>
      </ul>
      <p>Considere fazer uma nova compra ou transferência para manter sua conta ativa.</p>
    `;

    return await this.sendNotificationEmail(
      email,
      'Saldo Baixo',
      message,
      'warning'
    );
  }

  /**
   * Enviar email de relatório mensal
   */
  async sendMonthlyReport(email, reportData) {
    const message = `
      <h2>Relatório Mensal - ${new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}</h2>
      <p>Olá!</p>
      <p>Seu relatório mensal está pronto:</p>
      <ul>
        <li><strong>Total de transações:</strong> ${reportData.totalTransactions}</li>
        <li><strong>Saldo total:</strong> ${reportData.totalBalance.toLocaleString('pt-BR')} pontos</li>
        <li><strong>Valor investido:</strong> R$ ${reportData.totalInvested.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</li>
        <li><strong>Lucro total:</strong> R$ ${reportData.totalProfit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</li>
      </ul>
      <p>Acesse sua conta para ver o relatório completo com gráficos e análises detalhadas.</p>
    `;

    return await this.sendNotificationEmail(
      email,
      'Relatório Mensal',
      message,
      'info'
    );
  }

  /**
   * Enviar email genérico
   */
  async sendEmail(mailOptions) {
    if (!this.transporter) {
      throw new Error('Serviço de email não configurado');
    }

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('✅ Email enviado:', info.messageId);
      return info;
    } catch (error) {
      console.error('❌ Erro ao enviar email:', error);
      throw error;
    }
  }

  /**
   * Verificar se o serviço está configurado
   */
  isConfigured() {
    return !!(
      process.env.EMAIL_USER &&
      process.env.EMAIL_PASS &&
      this.transporter
    );
  }

  /**
   * Testar configuração do email
   */
  async testConnection() {
    if (!this.transporter) {
      throw new Error('Serviço de email não configurado');
    }

    try {
      await this.transporter.verify();
      return true;
    } catch (error) {
      console.error('❌ Erro na verificação do email:', error);
      return false;
    }
  }
}

// Criar instância única do serviço
const emailService = new EmailService();

module.exports = emailService;
