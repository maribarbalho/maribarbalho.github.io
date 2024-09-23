document.getElementById('adicionar').addEventListener('click', function() {
  const horarios = document.getElementById('horarios');
  const novaEntradaSaida = document.createElement('div');
  novaEntradaSaida.className = 'entrada-saida';

  novaEntradaSaida.innerHTML = `
      <div class="input-group">
          <label>Hora de Entrada:</label>
          <input type="time" class="entrada">
      </div>
      <div class="input-group">
          <label>Hora de Saída:</label>
          <input type="time" class="saida">
      </div>
  `;

  horarios.appendChild(novaEntradaSaida);
  document.getElementById('remover').style.display = 'block'; // Exibe o botão de remover
});

document.getElementById('remover').addEventListener('click', function() {
  const horarios = document.getElementById('horarios');
  const entradasSaidas = horarios.getElementsByClassName('entrada-saida');
  
  // Remove o último bloco de entradas/saídas, se existir
  if (entradasSaidas.length > 0) {
      horarios.removeChild(entradasSaidas[entradasSaidas.length - 1]);
  }
  
  // Esconder o botão de remover se não houver entradas/saídas
  if (entradasSaidas.length <= 1) {
      document.getElementById('remover').style.display = 'none';
  }
});

document.getElementById('calcular').addEventListener('click', function() {
  const entradas = document.querySelectorAll('.entrada');
  const saidas = document.querySelectorAll('.saida');

  let totalMinutosTrabalhados = 0;

  for (let i = 0; i < entradas.length; i++) {
      const entrada = entradas[i].value;
      const saida = saidas[i].value;

      if (!entrada || !saida) {
          alert('Por favor, preencha todos os campos.');
          return;
      }

      const [horaEntrada, minutoEntrada] = entrada.split(':').map(Number);
      const [horaSaida, minutoSaida] = saida.split(':').map(Number);

      totalMinutosTrabalhados += (horaSaida * 60 + minutoSaida) - (horaEntrada * 60 + minutoEntrada);
  }

  const horasTrabalhadas = Math.floor(totalMinutosTrabalhados / 60);
  const minutosTrabalhados = totalMinutosTrabalhados % 60;

  // Formatar horas e minutos com dois dígitos
  const horasFormatadas = String(horasTrabalhadas).padStart(2, '0');
  const minutosFormatados = String(minutosTrabalhados).padStart(2, '0');

  document.getElementById('totalHoras').textContent = `${horasFormatadas}h${minutosFormatados}m`;
});
