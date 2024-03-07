import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCol, IonGrid, IonIcon, IonRow, IonText } from '@ionic/react';
import { returnUpBackOutline, returnUpForwardOutline } from 'ionicons/icons';
import {useState  } from 'react';
import { Link } from 'react-router-dom';
import '../mobile/mobile.css';
interface ReportCardProps {
    title: string;
    data: any; 
    keys: string[];
    keyMap: Record<string, string>;   
    id:string;
    rol:string;
  }
  function ReportCard({ title, data, keys, keyMap, id , rol }: ReportCardProps) {

  const [currentPage, setCurrentPage] = useState(1); // Página actual
  const itemsPerPage = 7;
    // Verificar si data es un array válido antes de usar map  
     
 
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return (
      <IonCard className="plants">
        <IonCardHeader>
          <IonCardTitle className="blanc">{title}</IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          <IonGrid>
            <IonRow>
              {/* Encabezados de columna */}
              {keys.map((key) => (
                <IonCol key={key}>
                  <IonText className="ion-text-center">{key}</IonText>
                  <hr style={{ borderTop: '1px solid black', margin: '8px 0' }} />
                </IonCol>
              ))}
            </IonRow>
            {Object.values(data).reverse()
              .slice(startIndex, endIndex) // Filtra los elementos a mostrar en la página actual
              .map((item: any, index) => (
                <IonRow key={index}>
                  {keys.map((key) => (
                   <IonCol key={key}>
                   <IonText className="ion-text-center">
                     {rol === 'Usuario' ? (
                       <Link to={`/alert/${id}?key=${item.key}&fecha=${item.fecha}`} className='seleccionar'>
                         {item[keyMap[key]] !== null && item[keyMap[key]] !== '' ? item[keyMap[key]] : 'No reporto'}
                       </Link>
                     ) : (
                       // Mostrar solo el texto o información sin el enlace
                       item[keyMap[key]] !== null && item[keyMap[key]] !== '' ? item[keyMap[key]] : 'No reporto'
                     )}
                   </IonText>
                 </IonCol>
                  ))}
                </IonRow>
              ))}
          </IonGrid>
          {/* Controles de paginación */}
          <div className="pagination">
            <IonButton fill='clear'
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
          <IonIcon icon={returnUpBackOutline}></IonIcon>
            </IonButton>
            <span>Página {currentPage}</span>
            <IonButton fill='clear'
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={endIndex >= Object.values(data).length || 0}
            >
           <IonIcon icon={returnUpForwardOutline}></IonIcon> 
            </IonButton>
          </div>
        </IonCardContent>
      </IonCard>
    );
  }
  
  export default ReportCard;