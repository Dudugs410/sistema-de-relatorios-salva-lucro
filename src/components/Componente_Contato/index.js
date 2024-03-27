import React, { useState } from 'react';

const Contato = () => {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    menssagem: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you can send the form data to your server or use a service to handle form submission
    // Example: fetch('/submitForm', { method: 'POST', body: formData })
    // Then redirect the user to an email address
    window.location.href = `mailto:example@example.com?subject=${formData.nome}&body=${formData.menssagem}`;
  };

  return (
    <form className='form-contato-container' onSubmit={handleSubmit}>
      <div className=''>
        <label htmlFor="nome">Nome:</label>
        <input
          type="text"
          id="nome"
          name="nome"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="email">E-mail:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="menssagem">Mensagem:</label>
        <textarea
          id="menssagem"
          name="menssagem"
          value={formData.menssagem}
          onChange={handleChange}
          required
        />
      </div>
      <button type="submit">Enviar</button>
    </form>
  );
};

export default Contato;