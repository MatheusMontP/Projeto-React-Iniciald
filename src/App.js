import React, { useState } from 'react';

const LIMITE_ALCOOL = 0.7;

function converterPreco(valor) {
  const valorNormalizado = String(valor).trim().replace(/R\$\s?/gi, '');

  if (!valorNormalizado) return 0;

  const ultimaVirgula = valorNormalizado.lastIndexOf(',');
  const ultimoPonto = valorNormalizado.lastIndexOf('.');

  if (ultimaVirgula > -1 && ultimoPonto > -1) {
    if (ultimaVirgula > ultimoPonto) {
      return Number(valorNormalizado.replace(/\./g, '').replace(',', '.')) || 0;
    }

    return Number(valorNormalizado.replace(/,/g, '')) || 0;
  }

  return Number(valorNormalizado.replace(',', '.')) || 0;
}

function formatarPreco(valor) {
  return valor.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function CampoPreco({ id, rotulo, valor, aoAlterar, exemplo }) {
  return (
    <label className="field" htmlFor={id}>
      <span>{rotulo}</span>
      <div className="input-wrapper">
        <span aria-hidden="true">R$</span>
        <input
          id={id}
          type="text"
          inputMode="decimal"
          value={valor}
          onChange={(evento) => aoAlterar(evento.target.value)}
          placeholder={exemplo}
        />
      </div>
    </label>
  );
}

function Resultado({ precoAlcool, precoGasolina }) {
  const alcool = converterPreco(precoAlcool);
  const gasolina = converterPreco(precoGasolina);
  const proporcao = alcool / gasolina;
  const alcoolMaisVantajoso = proporcao < LIMITE_ALCOOL;

  return (
    <section
      className={`result ${alcoolMaisVantajoso ? 'result-alcohol' : 'result-gasoline'}`}
      aria-live="polite"
    >
      <span className="result-label">Recomendação</span>
      <h2>Abasteça com {alcoolMaisVantajoso ? 'álcool' : 'gasolina'}.</h2>
      <p>
        O álcool está custando <strong>{(proporcao * 100).toFixed(1)}%</strong> do preço da gasolina.
      </p>
      <small>
        Cálculo: R$ {formatarPreco(alcool)} ÷ R$ {formatarPreco(gasolina)} = {proporcao.toFixed(2)}
      </small>
    </section>
  );
}

function App() {
  const [precoAlcool, definirPrecoAlcool] = useState('');
  const [precoGasolina, definirPrecoGasolina] = useState('');
  const [foiCalculado, definirFoiCalculado] = useState(false);

  const podeCalcular = converterPreco(precoAlcool) > 0 && converterPreco(precoGasolina) > 0;

  function lidarComEnvio(evento) {
    evento.preventDefault();
    if (podeCalcular) definirFoiCalculado(true);
  }

  function limparCampos() {
    definirPrecoAlcool('');
    definirPrecoGasolina('');
    definirFoiCalculado(false);
  }

  return (
    <main className="page-shell">
      <div className="calculator-card">
        <div className="intro">
          <span className="eyebrow">Desafio React</span>
          <h1>Álcool ou gasolina?</h1>
          <p>Descubra qual combustível vale mais a pena com base nos preços por litro.</p>
        </div>

        <form onSubmit={lidarComEnvio}>
          <div className="fields-grid">
            <CampoPreco
              id="preco-alcool"
              rotulo="Preço do álcool"
              valor={precoAlcool}
              aoAlterar={definirPrecoAlcool}
              exemplo="3,29"
            />
            <CampoPreco
              id="preco-gasolina"
              rotulo="Preço da gasolina"
              valor={precoGasolina}
              aoAlterar={definirPrecoGasolina}
              exemplo="4,92"
            />
          </div>

          <div className="actions">
            <button className="primary-button" type="submit" disabled={!podeCalcular}>
              Calcular melhor opção
            </button>
            <button className="secondary-button" type="button" onClick={limparCampos}>
              Limpar
            </button>
          </div>
        </form>

        {foiCalculado && <Resultado precoAlcool={precoAlcool} precoGasolina={precoGasolina} />}

        <footer>
          <span>Regra usada</span>
          <strong>álcool ÷ gasolina &lt; 0,7</strong>
        </footer>
      </div>
    </main>
  );
}

export default App;
