import React, { useState, useEffect } from 'react';
import './ItensNFForm.css';

/**
 * Componente para formulário de itens da nota fiscal
 * Usado tanto para NFe quanto para NFCe
 */
const ItensNFForm = ({ 
  items = [], 
  onChange, 
  isNFCe = false,
  className = '' 
}) => {
  const [formItems, setFormItems] = useState(items.length > 0 ? items : [createEmptyItem()]);
  const [errors, setErrors] = useState({});

  function createEmptyItem() {
    return {
      id: Date.now() + Math.random(),
      codigo: '',
      codigoBarras: '',
      descricao: '',
      ncm: '',
      cest: '',
      cfop: '',
      unidade: 'UN',
      quantidade: 1,
      valorUnitario: 0,
      valorTotal: 0,
      origem: 0,
      cstIcms: '00',
      aliquotaIcms: 0,
      cstIpi: '53',
      aliquotaIpi: 0,
      cstPis: '01',
      aliquotaPis: 0,
      cstCofins: '01',
      aliquotaCofins: 0,
      valorDesconto: 0,
      valorFrete: 0,
      valorSeguro: 0,
      outrasDesp: 0
    };
  }

  useEffect(() => {
    if (onChange) {
      onChange(formItems);
    }
  }, [formItems, onChange]);

  const handleItemChange = (index, field, value) => {
    const newItems = [...formItems];
    newItems[index] = {
      ...newItems[index],
      [field]: value
    };

    // Recalcular valor total quando quantidade ou valor unitário mudar
    if (field === 'quantidade' || field === 'valorUnitario') {
      const quantidade = field === 'quantidade' ? parseFloat(value) || 0 : parseFloat(newItems[index].quantidade) || 0;
      const valorUnitario = field === 'valorUnitario' ? parseFloat(value) || 0 : parseFloat(newItems[index].valorUnitario) || 0;
      newItems[index].valorTotal = quantidade * valorUnitario;
    }

    setFormItems(newItems);

    // Limpar erro do campo
    if (errors[`${index}_${field}`]) {
      setErrors(prev => ({
        ...prev,
        [`${index}_${field}`]: null
      }));
    }
  };

  const addItem = () => {
    setFormItems([...formItems, createEmptyItem()]);
  };

  const removeItem = (index) => {
    if (formItems.length > 1) {
      const newItems = formItems.filter((_, i) => i !== index);
      setFormItems(newItems);
    }
  };

  const duplicateItem = (index) => {
    const itemToDuplicate = { ...formItems[index] };
    itemToDuplicate.id = Date.now() + Math.random();
    const newItems = [...formItems];
    newItems.splice(index + 1, 0, itemToDuplicate);
    setFormItems(newItems);
  };

  const validateItems = () => {
    const newErrors = {};

    formItems.forEach((item, index) => {
      if (!item.descricao.trim()) {
        newErrors[`${index}_descricao`] = 'Descrição é obrigatória';
      }
      if (!item.quantidade || item.quantidade <= 0) {
        newErrors[`${index}_quantidade`] = 'Quantidade deve ser maior que zero';
      }
      if (!item.valorUnitario || item.valorUnitario <= 0) {
        newErrors[`${index}_valorUnitario`] = 'Valor unitário deve ser maior que zero';
      }
      if (!isNFCe && !item.ncm.trim()) {
        newErrors[`${index}_ncm`] = 'NCM é obrigatório para NFe';
      }
      if (!isNFCe && !item.cfop.trim()) {
        newErrors[`${index}_cfop`] = 'CFOP é obrigatório para NFe';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const formatCurrency = (value) => {
    const number = parseFloat(value) || 0;
    return number.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  const getTotalGeral = () => {
    return formItems.reduce((total, item) => total + (item.valorTotal || 0), 0);
  };

  // Opções para campos select
  const unidades = [
    'UN', 'PC', 'KG', 'G', 'L', 'ML', 'M', 'CM', 'M2', 'M3', 'CX', 'PCT', 'DZ', 'PAR'
  ];

  const origens = [
    { value: 0, label: '0 - Nacional' },
    { value: 1, label: '1 - Estrangeira - Importação direta' },
    { value: 2, label: '2 - Estrangeira - Adquirida no mercado interno' },
    { value: 3, label: '3 - Nacional - Mercadoria com Conteúdo de Importação superior a 40%' },
    { value: 4, label: '4 - Nacional - Produção em conformidade com processos produtivos básicos' },
    { value: 5, label: '5 - Nacional - Mercadoria com Conteúdo de Importação inferior ou igual a 40%' },
    { value: 6, label: '6 - Estrangeira - Importação direta, sem similar nacional' },
    { value: 7, label: '7 - Estrangeira - Adquirida no mercado interno, sem similar nacional' },
    { value: 8, label: '8 - Nacional - Mercadoria com Conteúdo de Importação superior a 70%' }
  ];

  const cstsIcms = [
    '00', '10', '20', '30', '40', '41', '50', '51', '60', '70', '90'
  ];

  const cstsIpi = [
    '00', '01', '02', '03', '04', '05', '49', '50', '51', '52', '53', '54', '55', '99'
  ];

  const cstsPisCofins = [
    '01', '02', '03', '04', '05', '06', '07', '08', '09', '49', '50', '51', '52', '53', '54', '55', '56', '60', '61', '62', '63', '64', '65', '66', '67', '70', '71', '72', '73', '74', '75', '98', '99'
  ];

  return (
    <div className={`itens-nf-form ${className}`}>
      <div className="form-header">
        <h3>Itens da {isNFCe ? 'NFCe' : 'NFe'}</h3>
        <button type="button" onClick={addItem} className="btn-add-item">
          + Adicionar Item
        </button>
      </div>

      <div className="items-container">
        {formItems.map((item, index) => (
          <div key={item.id} className="item-card">
            <div className="item-header">
              <span className="item-number">Item {index + 1}</span>
              <div className="item-actions">
                <button
                  type="button"
                  onClick={() => duplicateItem(index)}
                  className="btn-duplicate"
                  title="Duplicar item"
                >
                  📋
                </button>
                {formItems.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="btn-remove"
                    title="Remover item"
                  >
                    🗑️
                  </button>
                )}
              </div>
            </div>

            <div className="item-content">
              {/* Linha 1: Código e Descrição */}
              <div className="form-row">
                <div className="form-group">
                  <label>Código:</label>
                  <input
                    type="text"
                    value={item.codigo}
                    onChange={(e) => handleItemChange(index, 'codigo', e.target.value)}
                    placeholder="Código do produto"
                  />
                </div>
                <div className="form-group flex-3">
                  <label>Descrição: <span className="required">*</span></label>
                  <input
                    type="text"
                    value={item.descricao}
                    onChange={(e) => handleItemChange(index, 'descricao', e.target.value)}
                    placeholder="Descrição do produto"
                    className={errors[`${index}_descricao`] ? 'error' : ''}
                  />
                  {errors[`${index}_descricao`] && (
                    <span className="error-message">{errors[`${index}_descricao`]}</span>
                  )}
                </div>
                <div className="form-group">
                  <label>Código de Barras:</label>
                  <input
                    type="text"
                    value={item.codigoBarras}
                    onChange={(e) => handleItemChange(index, 'codigoBarras', e.target.value)}
                    placeholder="EAN/GTIN"
                  />
                </div>
              </div>

              {/* Linha 2: Quantidade, Unidade, Valores */}
              <div className="form-row">
                <div className="form-group">
                  <label>Quantidade: <span className="required">*</span></label>
                  <input
                    type="number"
                    step="0.001"
                    min="0"
                    value={item.quantidade}
                    onChange={(e) => handleItemChange(index, 'quantidade', e.target.value)}
                    className={errors[`${index}_quantidade`] ? 'error' : ''}
                  />
                  {errors[`${index}_quantidade`] && (
                    <span className="error-message">{errors[`${index}_quantidade`]}</span>
                  )}
                </div>
                <div className="form-group">
                  <label>Unidade:</label>
                  <select
                    value={item.unidade}
                    onChange={(e) => handleItemChange(index, 'unidade', e.target.value)}
                  >
                    {unidades.map(unidade => (
                      <option key={unidade} value={unidade}>{unidade}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Valor Unitário: <span className="required">*</span></label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={item.valorUnitario}
                    onChange={(e) => handleItemChange(index, 'valorUnitario', e.target.value)}
                    className={errors[`${index}_valorUnitario`] ? 'error' : ''}
                  />
                  {errors[`${index}_valorUnitario`] && (
                    <span className="error-message">{errors[`${index}_valorUnitario`]}</span>
                  )}
                </div>
                <div className="form-group">
                  <label>Valor Total:</label>
                  <input
                    type="text"
                    value={formatCurrency(item.valorTotal)}
                    readOnly
                    className="readonly"
                  />
                </div>
              </div>

              {/* Linha 3: Classificações fiscais (apenas para NFe) */}
              {!isNFCe && (
                <div className="form-row">
                  <div className="form-group">
                    <label>NCM: <span className="required">*</span></label>
                    <input
                      type="text"
                      value={item.ncm}
                      onChange={(e) => handleItemChange(index, 'ncm', e.target.value)}
                      placeholder="00000000"
                      maxLength={8}
                      className={errors[`${index}_ncm`] ? 'error' : ''}
                    />
                    {errors[`${index}_ncm`] && (
                      <span className="error-message">{errors[`${index}_ncm`]}</span>
                    )}
                  </div>
                  <div className="form-group">
                    <label>CEST:</label>
                    <input
                      type="text"
                      value={item.cest}
                      onChange={(e) => handleItemChange(index, 'cest', e.target.value)}
                      placeholder="0000000"
                      maxLength={7}
                    />
                  </div>
                  <div className="form-group">
                    <label>CFOP: <span className="required">*</span></label>
                    <input
                      type="text"
                      value={item.cfop}
                      onChange={(e) => handleItemChange(index, 'cfop', e.target.value)}
                      placeholder="0000"
                      maxLength={4}
                      className={errors[`${index}_cfop`] ? 'error' : ''}
                    />
                    {errors[`${index}_cfop`] && (
                      <span className="error-message">{errors[`${index}_cfop`]}</span>
                    )}
                  </div>
                  <div className="form-group">
                    <label>Origem:</label>
                    <select
                      value={item.origem}
                      onChange={(e) => handleItemChange(index, 'origem', parseInt(e.target.value))}
                    >
                      {origens.map(origem => (
                        <option key={origem.value} value={origem.value}>
                          {origem.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* Linha 4: Impostos (apenas para NFe) */}
              {!isNFCe && (
                <div className="impostos-section">
                  <h4>Impostos</h4>
                  <div className="form-row">
                    <div className="form-group">
                      <label>CST ICMS:</label>
                      <select
                        value={item.cstIcms}
                        onChange={(e) => handleItemChange(index, 'cstIcms', e.target.value)}
                      >
                        {cstsIcms.map(cst => (
                          <option key={cst} value={cst}>{cst}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Alíquota ICMS (%):</label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        max="100"
                        value={item.aliquotaIcms}
                        onChange={(e) => handleItemChange(index, 'aliquotaIcms', e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label>CST IPI:</label>
                      <select
                        value={item.cstIpi}
                        onChange={(e) => handleItemChange(index, 'cstIpi', e.target.value)}
                      >
                        {cstsIpi.map(cst => (
                          <option key={cst} value={cst}>{cst}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Alíquota IPI (%):</label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        max="100"
                        value={item.aliquotaIpi}
                        onChange={(e) => handleItemChange(index, 'aliquotaIpi', e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>CST PIS:</label>
                      <select
                        value={item.cstPis}
                        onChange={(e) => handleItemChange(index, 'cstPis', e.target.value)}
                      >
                        {cstsPisCofins.map(cst => (
                          <option key={cst} value={cst}>{cst}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Alíquota PIS (%):</label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        max="100"
                        value={item.aliquotaPis}
                        onChange={(e) => handleItemChange(index, 'aliquotaPis', e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label>CST COFINS:</label>
                      <select
                        value={item.cstCofins}
                        onChange={(e) => handleItemChange(index, 'cstCofins', e.target.value)}
                      >
                        {cstsPisCofins.map(cst => (
                          <option key={cst} value={cst}>{cst}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Alíquota COFINS (%):</label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        max="100"
                        value={item.aliquotaCofins}
                        onChange={(e) => handleItemChange(index, 'aliquotaCofins', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Linha 5: Valores adicionais (apenas para NFe) */}
              {!isNFCe && (
                <div className="form-row">
                  <div className="form-group">
                    <label>Desconto:</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={item.valorDesconto}
                      onChange={(e) => handleItemChange(index, 'valorDesconto', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Frete:</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={item.valorFrete}
                      onChange={(e) => handleItemChange(index, 'valorFrete', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Seguro:</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={item.valorSeguro}
                      onChange={(e) => handleItemChange(index, 'valorSeguro', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Outras Despesas:</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={item.outrasDesp}
                      onChange={(e) => handleItemChange(index, 'outrasDesp', e.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="form-footer">
        <div className="total-section">
          <strong>Total Geral: {formatCurrency(getTotalGeral())}</strong>
        </div>
        <div className="form-actions">
          <button
            type="button"
            onClick={validateItems}
            className="btn-validate"
          >
            Validar Itens
          </button>
        </div>
      </div>
    </div>
  );
};

export default ItensNFForm;