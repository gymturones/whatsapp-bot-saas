#!/usr/bin/env python3
# scripts/generate_guide_pdf.py

from reportlab.lib.pagesizes import letter, A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak, Table, TableStyle
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_JUSTIFY
import datetime

def create_guide_pdf(output_path="guia_automatizacion.pdf"):
    """Genera el PDF de la guía de automatización"""
    
    # Setup documento
    doc = SimpleDocTemplate(
        output_path,
        pagesize=letter,
        rightMargin=0.75*inch,
        leftMargin=0.75*inch,
        topMargin=0.75*inch,
        bottomMargin=0.75*inch
    )
    
    # Estilos
    styles = getSampleStyleSheet()
    
    # Crear estilos personalizados
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontSize=28,
        textColor=colors.HexColor('#1F2937'),
        spaceAfter=6,
        alignment=TA_CENTER,
        fontName='Helvetica-Bold'
    )
    
    heading_style = ParagraphStyle(
        'CustomHeading',
        parent=styles['Heading2'],
        fontSize=16,
        textColor=colors.HexColor('#111827'),
        spaceAfter=12,
        spaceBefore=12,
        fontName='Helvetica-Bold'
    )
    
    body_style = ParagraphStyle(
        'CustomBody',
        parent=styles['Normal'],
        fontSize=11,
        textColor=colors.HexColor('#374151'),
        spaceAfter=10,
        alignment=TA_JUSTIFY,
        leading=16
    )
    
    # Contenido
    story = []
    
    # Portada
    story.append(Spacer(1, 1.5*inch))
    story.append(Paragraph("Automatización para PyMEs", title_style))
    story.append(Paragraph("sin Programar", title_style))
    story.append(Spacer(1, 0.3*inch))
    story.append(Paragraph("Guía Completa 2025", styles['Heading3']))
    story.append(Spacer(1, 2*inch))
    
    # Información
    info = f"""
    <para align="center">
    <b>Cómo ahorrar 30% en costos operativos<br/>
    y ganar 8 horas/semana</b>
    <br/><br/>
    Última actualización: Marzo 2025<br/>
    Versión: 1.0
    </para>
    """
    story.append(Paragraph(info, styles['Normal']))
    
    story.append(PageBreak())
    
    # Índice
    story.append(Paragraph("ÍNDICE", heading_style))
    
    toc_items = [
        "1. Introducción",
        "2. ¿Por qué Automatizar?",
        "3. Herramientas Esenciales (Gratuitas)",
        "4. Automatización Paso a Paso",
        "5. Templates Listos para Usar",
        "6. Casos de Éxito",
        "7. Checklist de Implementación"
    ]
    
    for item in toc_items:
        story.append(Paragraph(f"<bullet>•</bullet> {item}", body_style))
    
    story.append(PageBreak())
    
    # 1. Introducción
    story.append(Paragraph("1. INTRODUCCIÓN", heading_style))
    
    intro_text = """
    Esta guía te enseña cómo automatizar las tareas repetitivas de tu PyME 
    <b>sin saber programar</b>, usando herramientas gratuitas o económicas.
    <br/><br/>
    La automatización no es un lujo, es una necesidad para sobrevivir en 2025.
    <br/><br/>
    Dato: 77% de pequeñas empresas ya usan alguna herramienta de automatización 
    (Make.com, Zapier, Google Sheets, etc).
    """
    story.append(Paragraph(intro_text, body_style))
    
    story.append(Spacer(1, 0.2*inch))
    
    # Tabla de tiempo
    time_data = [
        ['Concepto', 'Tiempo'],
        ['Lectura de esta guía', '15 minutos'],
        ['Implementación', '2-3 horas'],
        ['Primeros resultados', '1 semana'],
        ['Ahorros mensuales', '$300-2,000']
    ]
    
    time_table = Table(time_data, colWidths=[3*inch, 2.25*inch])
    time_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#111827')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 11),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
        ('GRID', (0, 0), (-1, -1), 1, colors.black),
        ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
        ('FONTSIZE', (0, 1), (-1, -1), 10),
    ]))
    
    story.append(time_table)
    
    story.append(PageBreak())
    
    # 2. Por qué automatizar
    story.append(Paragraph("2. ¿POR QUÉ AUTOMATIZAR?", heading_style))
    
    why_text = """
    <b>Números reales de 2025:</b>
    <br/>
    • 77% de pequeñas empresas usan IA/automatización<br/>
    • Ahorran <b>30% en costos operativos</b><br/>
    • Aumentan <b>50% en productividad</b><br/>
    • Reducen <b>2-3 horas/día</b> en tareas manuales
    <br/><br/>
    
    <b>Tu situación actual (probablemente):</b><br/>
    ✗ Respondes WhatsApp manualmente<br/>
    ✗ Escribes emails uno a uno<br/>
    ✗ Actualización manual de inventario<br/>
    ✗ Seguimiento de leads a mano<br/>
    ✗ Facturas generadas manualmente
    <br/><br/>
    
    <b>Después de automatizar:</b><br/>
    ✓ Respuestas automáticas en WhatsApp<br/>
    ✓ Emails de seguimiento se envían solos<br/>
    ✓ Inventario se actualiza automáticamente<br/>
    ✓ Leads filtrados y priorizados<br/>
    ✓ Facturas generadas con un click
    """
    
    story.append(Paragraph(why_text, body_style))
    
    story.append(Spacer(1, 0.3*inch))
    
    # ROI Example
    roi_text = """
    <b>Ejemplo de ROI: PyME con 5 empleados</b>
    <br/><br/>
    
    <b>ANTES:</b><br/>
    1 empleado gasta 8 horas/día en tareas repetitivas<br/>
    Costo: 8h × $15/h = $120/día = <b>$2,400/mes</b>
    <br/><br/>
    
    <b>DESPUÉS (con automatización):</b><br/>
    Mismo empleado dedica 2 horas/día a tareas automáticas<br/>
    Ahorro: 6 horas/día = $1,800/mes<br/>
    Costo de herramientas: $50-100/mes<br/>
    <b>Ganancia neta: $1,700-1,750/mes</b>
    <br/><br/>
    
    <b style="color:#22c55e">Payback: 3-7 días</b>
    """
    
    story.append(Paragraph(roi_text, body_style))
    
    # Build PDF
    doc.build(story)
    print(f"✅ PDF generado: {output_path}")

if __name__ == "__main__":
    create_guide_pdf("/mnt/user-data/outputs/guia_automatizacion_pymes.pdf")
