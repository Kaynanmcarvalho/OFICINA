# 📚 Exemplos de Uso dos Componentes

## Guia prático com exemplos de código para cada componente

---

## 🎯 Dashboard Components

### 1. OperationalDashboard

```jsx
import OperationalDashboard from './componentes/dashboard/OperationalDashboard';

function CheckInPage() {
  const [checkins, setCheckins] = useState([]);
  const [filteredCheckins, setFilteredCheckins] = useState([]);

  const handleFilterChange = (filters) => {
    // Aplicar filtros
    const filtered = checkins.filter(checkin => {
      if (filters.status && filters.status !== 'all') {
        return checkin.status === filters.status;
      }
      return true;
    });
    setFilteredCheckins(filtered);
  };

  return (
    <div>
      <OperationalDashboard
        checkins={checkins}
        dailyTarget={10}
        onFilterChange={handleFilterChange}
      />
      
      {/* Lista de check-ins filtrados */}
      {filteredCheckins.map(checkin => (
        <CheckinCard key={checkin.id} data={checkin} />
      ))}
    </div>
  );
}
```

### 2. InsightsDashboard

```jsx
import InsightsDashboard from './componentes/dashboard/InsightsDashboard';

function AnalyticsSection() {
  const [checkins, setCheckins] = useState([]);
  const [daysRange, setDaysRange] = useState(30);

  return (
    <div className="mt-8">
      {/* Seletor de período */}
      <select 
        value={daysRange} 
        onChange={(e) => setDaysRange(Number(e.target.value))}
      >
        <option value={7}>Últimos 7 dias</option>
        <option value={30}>Últimos 30 dias</option>
        <option value={90}>Últimos 90 dias</option>
      </select>

      <InsightsDashboard
        checkins={checkins}
        daysRange={daysRange}
      />
    </div>
  );
}
```

---

## 📸 Check-in Components

### 3. QRCodeScanner

```jsx
import { useState } from 'react';
import QRCodeScanner from './componentes/checkin/QRCodeScanner';

function CheckInModal() {
  const [showScanner, setShowScanner] = useState(false);
  const [vehicleData, setVehicleData] = useState(null);

  const handleQRScan = async (data) => {
    // data = { type: 'vehicle', vehicleId, plate, clientId }
    
    // Buscar dados completos do veículo
    const vehicle = await fetchVehicleById(data.vehicleId);
    const client = await fetchClientById(data.clientId);
    
    // Preencher formulário automaticamente
    setVehicleData(vehicle);
    setClientData(client);
    
    setShowScanner(false);
  };

  return (
    <div>
      <button onClick={() => setShowScanner(true)}>
        📱 Escanear QR Code
      </button>

      <QRCodeScanner
        isOpen={showScanner}
        onScan={handleQRScan}
        onClose={() => setShowScanner(false)}
      />
    </div>
  );
}
```

### 4. PhotoCapture

```jsx
import PhotoCapture from './componentes/checkin/PhotoCapture';

function CheckInForm() {
  const [photos, setPhotos] = useState([]);

  const handlePhotosCapture = async (capturedPhotos) => {
    // capturedPhotos = array de File objects
    
    // Upload para Firebase Storage
    const uploadPromises = capturedPhotos.map(async (photo) => {
      const storageRef = ref(storage, `checkins/${checkinId}/photos/entry/${photo.name}`);
      await uploadBytes(storageRef, photo);
      return getDownloadURL(storageRef);
    });

    const photoUrls = await Promise.all(uploadPromises);
    setPhotos(photoUrls);
  };

  return (
    <div>
      <PhotoCapture
        maxPhotos={4}
        onCapture={handlePhotosCapture}
      />
      
      {/* Preview das fotos */}
      <div className="grid grid-cols-2 gap-2 mt-4">
        {photos.map((url, index) => (
          <img key={index} src={url} alt={`Foto ${index + 1}`} />
        ))}
      </div>
    </div>
  );
}
```

### 5. DynamicChecklist

```jsx
import DynamicChecklist from './componentes/checkin/DynamicChecklist';

function VehicleInspection() {
  const [checklist, setChecklist] = useState([]);
  const [vehicleType, setVehicleType] = useState('car');

  const handleChecklistChange = (updatedChecklist) => {
    setChecklist(updatedChecklist);
    
    // Salvar no Firebase
    updateDoc(doc(db, 'checkins', checkinId), {
      checklist: updatedChecklist
    });
  };

  return (
    <DynamicChecklist
      vehicleType={vehicleType} // 'car', 'motorcycle', 'truck'
      initialChecklist={checklist}
      onChange={handleChecklistChange}
    />
  );
}
```

### 6. VoiceObservations

```jsx
import VoiceObservations from './componentes/checkin/VoiceObservations';

function ObservationsField() {
  const [observations, setObservations] = useState('');

  const handleVoiceTranscript = (transcript) => {
    // Adicionar transcrição ao texto existente
    setObservations(prev => 
      prev ? `${prev}\n${transcript}` : transcript
    );
  };

  return (
    <div>
      <label>Observações</label>
      <textarea
        value={observations}
        onChange={(e) => setObservations(e.target.value)}
        rows={4}
      />
      
      <VoiceObservations
        onTranscript={handleVoiceTranscript}
      />
    </div>
  );
}
```

---

## ✅ Check-out Components

### 7. ServiceSummary

```jsx
import ServiceSummary from './componentes/checkout/ServiceSummary';

function CheckOutModal() {
  const checkoutData = {
    services: 'Troca de óleo, Alinhamento, Balanceamento',
    duration: 7200000, // 2 horas em ms
    checklist: [
      { label: 'Freios', status: 'ok' },
      { label: 'Óleo', status: 'ok' },
      { label: 'Pneus', status: 'issue', notes: 'Desgaste irregular' }
    ],
    observations: 'Cliente relatou ruído ao frear',
    photos: {
      entry: ['url1', 'url2'],
      exit: ['url3', 'url4']
    }
  };

  return (
    <ServiceSummary
      checkoutData={checkoutData}
      vehicleData={vehicle}
      clientData={client}
    />
  );
}
```

### 8. DigitalSignature

```jsx
import DigitalSignature from './componentes/checkout/DigitalSignature';

function SignatureSection() {
  const [signatureUrl, setSignatureUrl] = useState(null);

  const handleSignatureSave = async (signatureDataUrl) => {
    // Converter dataURL para Blob
    const blob = await fetch(signatureDataUrl).then(r => r.blob());
    
    // Upload para Firebase Storage
    const storageRef = ref(storage, `checkins/${checkinId}/signature.png`);
    await uploadBytes(storageRef, blob);
    const url = await getDownloadURL(storageRef);
    
    setSignatureUrl(url);
    
    // Salvar no Firestore
    await updateDoc(doc(db, 'checkins', checkinId), {
      'checkoutData.signature': url
    });
  };

  return (
    <div>
      <h3>Assinatura do Cliente</h3>
      <DigitalSignature
        onSave={handleSignatureSave}
        required={true}
      />
      
      {signatureUrl && (
        <div className="mt-4">
          <p>Assinatura capturada:</p>
          <img src={signatureUrl} alt="Assinatura" />
        </div>
      )}
    </div>
  );
}
```

### 9. PDFGenerator

```jsx
import { generateServicePDF, downloadPDF, generatePDFFilename } from './componentes/checkout/PDFGenerator';

function GeneratePDFButton() {
  const [generating, setGenerating] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);

  const handleGeneratePDF = async () => {
    setGenerating(true);
    
    try {
      // Gerar PDF
      const pdfBlob = await generateServicePDF({
        checkoutData: {
          services: ['Troca de óleo', 'Alinhamento'],
          checklist: checklist,
          observations: observations,
          duration: duration
        },
        vehicleData: vehicle,
        clientData: client,
        signatureUrl: signatureUrl,
        photos: photos
      });

      // Upload para Firebase Storage
      const filename = generatePDFFilename(vehicle.plate);
      const storageRef = ref(storage, `checkins/${checkinId}/${filename}`);
      await uploadBytes(storageRef, pdfBlob);
      const url = await getDownloadURL(storageRef);
      
      setPdfUrl(url);
      
      // Salvar URL no Firestore
      await updateDoc(doc(db, 'checkins', checkinId), {
        'checkoutData.pdfUrl': url
      });

      // Download automático
      downloadPDF(pdfBlob, filename);
      
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      alert('Erro ao gerar PDF');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div>
      <button 
        onClick={handleGeneratePDF}
        disabled={generating}
      >
        {generating ? 'Gerando PDF...' : '📄 Gerar PDF'}
      </button>
      
      {pdfUrl && (
        <a href={pdfUrl} target="_blank" rel="noopener noreferrer">
          Ver PDF
        </a>
      )}
    </div>
  );
}
```

### 10. MaintenanceScheduler

```jsx
import MaintenanceScheduler from './componentes/checkout/MaintenanceScheduler';

function ScheduleSection() {
  const handleSchedule = async (scheduleData) => {
    // scheduleData = {
    //   date: '2024-12-01',
    //   serviceType: 'troca_oleo',
    //   serviceName: 'Troca de Óleo',
    //   reminderEnabled: true,
    //   scheduledAt: '2024-11-01T10:00:00Z'
    // }

    // Salvar no Firestore
    await setDoc(doc(db, 'maintenanceSchedules', scheduleId), {
      vehicleId: vehicle.id,
      clientId: client.id,
      ...scheduleData
    });

    // Se reminder habilitado, agendar Cloud Function
    if (scheduleData.reminderEnabled) {
      // Implementar lógica de agendamento
    }
  };

  return (
    <MaintenanceScheduler
      lastService={{ type: 'troca_oleo', date: new Date() }}
      vehicleType="car"
      onSchedule={handleSchedule}
    />
  );
}
```

### 11. ServiceRating

```jsx
import ServiceRating from './componentes/checkout/ServiceRating';

function RatingSection() {
  const handleRating = async (ratingData) => {
    // ratingData = {
    //   rating: 5,
    //   feedback: 'Excelente serviço!',
    //   timestamp: '2024-11-01T10:00:00Z'
    // }

    if (ratingData.skipped) {
      // Cliente pulou avaliação
      return;
    }

    // Salvar no Firestore
    await updateDoc(doc(db, 'checkins', checkinId), {
      'checkoutData.rating': ratingData.rating,
      'checkoutData.feedback': ratingData.feedback,
      'checkoutData.ratedAt': ratingData.timestamp
    });

    // Atualizar média de avaliações da oficina
    await updateAverageRating(ratingData.rating);
  };

  return (
    <ServiceRating
      onRate={handleRating}
      optional={true}
    />
  );
}
```

### 12. ShareButtons

```jsx
import ShareButtons from './componentes/shared/ShareButtons';

function ShareSection() {
  return (
    <ShareButtons
      clientData={{
        name: 'João Silva',
        phone: '11987654321',
        email: 'joao@email.com'
      }}
      pdfUrl="https://storage.googleapis.com/.../relatorio.pdf"
      serviceData={{
        vehicleBrand: 'Toyota',
        vehicleModel: 'Corolla',
        vehiclePlate: 'ABC1234',
        services: 'Troca de óleo, Alinhamento'
      }}
    />
  );
}
```

---

## 📊 History Components

### 13. VehicleTimeline

```jsx
import VehicleTimeline from './componentes/history/VehicleTimeline';

function VehicleDetailPage() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    // Buscar histórico do veículo
    const fetchHistory = async () => {
      const q = query(
        collection(db, 'checkins'),
        where('vehicleId', '==', vehicleId),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setHistory(data);
    };
    
    fetchHistory();
  }, [vehicleId]);

  const handleExport = async () => {
    // Gerar PDF do histórico completo
    const pdfBlob = await generateHistoryPDF(history);
    downloadPDF(pdfBlob, `historico_${vehicle.plate}.pdf`);
  };

  return (
    <VehicleTimeline
      history={history}
      onExport={handleExport}
    />
  );
}
```

### 14. RecurrenceAnalyzer

```jsx
import RecurrenceAnalyzer from './componentes/history/RecurrenceAnalyzer';

function RecurrenceSection() {
  const [history, setHistory] = useState([]);
  const [monthsToAnalyze, setMonthsToAnalyze] = useState(6);

  return (
    <div>
      <select 
        value={monthsToAnalyze}
        onChange={(e) => setMonthsToAnalyze(Number(e.target.value))}
      >
        <option value={3}>Últimos 3 meses</option>
        <option value={6}>Últimos 6 meses</option>
        <option value={12}>Último ano</option>
      </select>

      <RecurrenceAnalyzer
        history={history}
        monthsToAnalyze={monthsToAnalyze}
      />
    </div>
  );
}
```

---

## 🔗 Exemplo Completo: Fluxo Check-in → Check-out

```jsx
import { useState } from 'react';
import QRCodeScanner from './componentes/checkin/QRCodeScanner';
import PhotoCapture from './componentes/checkin/PhotoCapture';
import DynamicChecklist from './componentes/checkin/DynamicChecklist';
import DigitalSignature from './componentes/checkout/DigitalSignature';
import { generateServicePDF } from './componentes/checkout/PDFGenerator';
import MaintenanceScheduler from './componentes/checkout/MaintenanceScheduler';
import ServiceRating from './componentes/checkout/ServiceRating';
import ShareButtons from './componentes/shared/ShareButtons';

function CompleteCheckInCheckOutFlow() {
  // Estados
  const [step, setStep] = useState('checkin'); // 'checkin' | 'checkout'
  const [vehicleData, setVehicleData] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [checklist, setChecklist] = useState([]);
  const [signatureUrl, setSignatureUrl] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);

  // Check-in
  const handleQRScan = async (data) => {
    const vehicle = await fetchVehicle(data.vehicleId);
    setVehicleData(vehicle);
  };

  const handleCheckInComplete = async () => {
    // Salvar check-in no Firebase
    const checkinRef = await addDoc(collection(db, 'checkins'), {
      vehicleId: vehicleData.id,
      photos: { entry: photos },
      checklist: checklist,
      status: 'active',
      createdAt: new Date()
    });
    
    setStep('checkout');
  };

  // Check-out
  const handleCheckOutComplete = async () => {
    // Gerar PDF
    const pdfBlob = await generateServicePDF({
      checkoutData: { /* ... */ },
      vehicleData,
      clientData,
      signatureUrl,
      photos
    });

    // Upload PDF
    const url = await uploadPDF(pdfBlob);
    setPdfUrl(url);

    // Atualizar status
    await updateDoc(doc(db, 'checkins', checkinId), {
      status: 'completed',
      'checkoutData.pdfUrl': url,
      'checkoutData.signature': signatureUrl,
      completedAt: new Date()
    });
  };

  return (
    <div>
      {step === 'checkin' && (
        <div>
          <h2>Check-in</h2>
          
          <QRCodeScanner
            isOpen={showScanner}
            onScan={handleQRScan}
            onClose={() => setShowScanner(false)}
          />

          <PhotoCapture
            maxPhotos={4}
            onCapture={setPhotos}
          />

          <DynamicChecklist
            vehicleType={vehicleData?.type}
            onChange={setChecklist}
          />

          <button onClick={handleCheckInComplete}>
            Finalizar Check-in
          </button>
        </div>
      )}

      {step === 'checkout' && (
        <div>
          <h2>Check-out</h2>

          <DigitalSignature
            onSave={setSignatureUrl}
            required={true}
          />

          <MaintenanceScheduler
            vehicleType={vehicleData.type}
            onSchedule={handleSchedule}
          />

          <ServiceRating
            onRate={handleRating}
            optional={true}
          />

          {pdfUrl && (
            <ShareButtons
              clientData={clientData}
              pdfUrl={pdfUrl}
              serviceData={vehicleData}
            />
          )}

          <button onClick={handleCheckOutComplete}>
            Finalizar Check-out
          </button>
        </div>
      )}
    </div>
  );
}
```

---

## 💡 Dicas de Uso

### Performance
- Use `useMemo` para cálculos pesados
- Implemente lazy loading para componentes grandes
- Comprima imagens antes do upload

### UX
- Sempre forneça feedback visual
- Use loading states
- Implemente error boundaries

### Firebase
- Configure índices para queries complexas
- Use batch writes quando possível
- Implemente retry logic para uploads

---

**Todos os componentes estão prontos para uso!** 🚀
