import {
  BOTTLENECKS,
  DIMENSIONS,
  diagnosisText,
  LEVELS,
  LEVEL_5_ACTIONS,
  type Level,
  type TestResult,
} from '@/data/maturityTest';

interface PdfInput {
  name: string;
  company?: string;
  /** Resumo do perfil da empresa, quando informado. */
  profile?: string;
  result: TestResult;
}

type RGB = [number, number, number];

const INK: RGB = [10, 10, 16];
const TEXT: RGB = [30, 30, 40];
const MUTED: RGB = [110, 110, 126];
const TRACK: RGB = [230, 230, 238];
const PRIMARY: RGB = [155, 90, 246];

const hexToRgb = (hex: string): RGB => {
  const h = hex.replace('#', '');
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
};

const loadDataUrl = async (url: string): Promise<string | null> => {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const blob = await res.blob();
    return await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(typeof reader.result === 'string' ? reader.result : null);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
};

const slug = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

export async function downloadMaturityPdf({ name, company, profile, result }: PdfInput) {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const W = 210;
  const H = 297;
  const M = 18;
  const CW = W - M * 2;
  const level = result.level as Level;
  const info = LEVELS[level];
  const color = hexToRgb(info.color);
  let y = 0;

  const fill = (c: RGB) => doc.setFillColor(c[0], c[1], c[2]);
  const ink = (c: RGB) => doc.setTextColor(c[0], c[1], c[2]);
  const draw = (c: RGB) => doc.setDrawColor(c[0], c[1], c[2]);

  const paragraph = (text: string, size: number, c: RGB, lineH: number, x = M, width = CW, style: 'normal' | 'bold' = 'normal') => {
    doc.setFont('helvetica', style);
    doc.setFontSize(size);
    ink(c);
    const lines = doc.splitTextToSize(text, width) as string[];
    lines.forEach((ln) => {
      doc.text(ln, x, y);
      y += lineH;
    });
  };

  const ensure = (space: number) => {
    if (y + space > H - 22) {
      doc.addPage();
      y = 22;
    }
  };

  // Cabeçalho escuro com a marca
  fill(INK);
  doc.rect(0, 0, W, 44, 'F');
  const logo = await loadDataUrl('/oca-mark-white.png');
  if (logo) doc.addImage(logo, 'PNG', M, 12, 34, 34 * (214 / 666));
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  ink(PRIMARY);
  doc.text('MODELO DE MATURIDADE IMOBILIÁRIA', M, 28);
  doc.setFontSize(19);
  ink([243, 243, 247]);
  doc.text('Diagnóstico da sua imobiliária', M, 37);
  y = 58;

  // Identificação
  const date = new Date().toLocaleDateString('pt-BR');
  paragraph(`Preparado para ${name}${company ? `, ${company}` : ''}`, 11, TEXT, 5.5, M, CW, 'bold');
  paragraph(date, 9.5, MUTED, 5);
  if (profile) paragraph(profile, 9, MUTED, 4.5);
  y += 6;

  // Nível
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(40);
  ink(color);
  doc.text(`Nível ${level}`, M, y + 12);
  const levelW = doc.getTextWidth(`Nível ${level}`);
  doc.setFontSize(14);
  ink(MUTED);
  doc.text('de 5', M + levelW + 3, y + 12);
  y += 22;
  doc.setFontSize(17);
  ink(TEXT);
  doc.text(info.name, M, y);
  y += 8;
  for (let i = 1; i <= 5; i++) {
    fill(i <= level ? hexToRgb(LEVELS[i as Level].color) : TRACK);
    doc.roundedRect(M + (i - 1) * 20, y, 17, 3.2, 1.6, 1.6, 'F');
  }
  y += 12;
  paragraph(info.description, 10.5, MUTED, 5.2);
  y += 2;
  paragraph(`Pontuação média: ${result.overall.toFixed(1)} de 5`, 9.5, MUTED, 5);
  y += 8;

  // Frentes
  paragraph('Como você está em cada frente', 13, TEXT, 6, M, CW, 'bold');
  y += 3;
  const barW = CW - 78;
  const top = y;
  result.dimensions.forEach((d) => {
    const weakest = d.id === result.weakest.id;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10.5);
    ink(TEXT);
    doc.text(d.name, M, y);
    const nameW = doc.getTextWidth(d.name);
    if (weakest) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      ink(PRIMARY);
      doc.text('menor pontuação', M + nameW + 3, y);
    }
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    ink(TEXT);
    doc.text(d.score.toFixed(1), M + barW, y, { align: 'right' });
    y += 3;
    fill(TRACK);
    doc.roundedRect(M, y, barW, 2.8, 1.4, 1.4, 'F');
    fill(weakest ? PRIMARY : color);
    doc.roundedRect(M, y, Math.max(2, (barW * d.score) / 5), 2.8, 1.4, 1.4, 'F');
    y += 9;
  });

  // Radar das cinco frentes, ao lado das barras
  const cx = M + barW + 43;
  const cy = top + 22;
  const R = 17;
  const pt = (i: number, ratio: number): [number, number] => {
    const angle = -Math.PI / 2 + (i * 2 * Math.PI) / DIMENSIONS.length;
    return [cx + Math.cos(angle) * R * ratio, cy + Math.sin(angle) * R * ratio];
  };
  const polygon = (pts: [number, number][], style: 'S' | 'FD') => {
    const segs = pts.slice(1).map(([px, py], i) => [px - pts[i][0], py - pts[i][1]]);
    doc.lines(segs, pts[0][0], pts[0][1], [1, 1], style, true);
  };
  doc.setLineWidth(0.2);
  draw(TRACK);
  for (let n = 1; n <= 5; n++) polygon(DIMENSIONS.map((_, i) => pt(i, n / 5)), 'S');
  DIMENSIONS.forEach((_, i) => {
    const [px, py] = pt(i, 1);
    doc.line(cx, cy, px, py);
  });
  fill([color[0] + (255 - color[0]) * 0.72, color[1] + (255 - color[1]) * 0.72, color[2] + (255 - color[2]) * 0.72].map(Math.round) as RGB);
  draw(color);
  doc.setLineWidth(0.6);
  polygon(result.dimensions.map((d, i) => pt(i, d.score / 5)), 'FD');
  doc.setLineWidth(0.2);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  ink(TEXT);
  DIMENSIONS.forEach((d, i) => {
    const [lx, ly] = pt(i, 1.28);
    const cos = Math.cos(-Math.PI / 2 + (i * 2 * Math.PI) / DIMENSIONS.length);
    doc.text(d.short, lx, ly + (i === 0 ? -0.5 : 1.5), { align: Math.abs(cos) < 0.2 ? 'center' : cos > 0 ? 'left' : 'right' });
  });

  y = Math.max(y, top + 50);
  paragraph(diagnosisText(result), 10, MUTED, 5);
  y += 2;

  // Gargalo e ações
  const next = level < 5 ? BOTTLENECKS[level as 1 | 2 | 3 | 4] : null;
  const actions = next ? next.actions : LEVEL_5_ACTIONS;
  const headline = next ? `Do Nível ${level} para o ${level + 1}: ${next.title.toLowerCase()}` : 'Você está no topo do modelo';
  const body = next ? next.text : 'No Nível 5 o desafio é não deixar a operação estagnar. A melhoria contínua é o que mantém a vantagem.';

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10.5);
  const bodyLines = doc.splitTextToSize(body, CW - 12) as string[];
  const actionLines = actions.map((a) => doc.splitTextToSize(a, CW - 22) as string[]);
  const boxH = 12 + 7 + bodyLines.length * 5.2 + 4 + actionLines.reduce((s, l) => s + l.length * 5.2 + 2, 0) + 6;
  ensure(boxH + 4);
  fill([245, 241, 253]);
  draw([225, 214, 250]);
  doc.roundedRect(M, y, CW, boxH, 3, 3, 'FD');
  let by = y + 10;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  ink(PRIMARY);
  doc.text('O GARGALO DA SUA PASSAGEM', M + 6, by);
  by += 7;
  doc.setFontSize(13);
  ink(TEXT);
  const hl = doc.splitTextToSize(headline, CW - 12) as string[];
  hl.forEach((ln) => {
    doc.text(ln, M + 6, by);
    by += 6;
  });
  by += 1;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10.5);
  ink(MUTED);
  bodyLines.forEach((ln) => {
    doc.text(ln, M + 6, by);
    by += 5.2;
  });
  by += 3;
  actionLines.forEach((lines) => {
    fill(PRIMARY);
    doc.circle(M + 8, by - 1.3, 1, 'F');
    ink(TEXT);
    lines.forEach((ln) => {
      doc.text(ln, M + 13, by);
      by += 5.2;
    });
    by += 2;
  });
  y += boxH + 8;

  // Próximo passo
  ensure(34);
  paragraph('Quer um plano para subir de nível?', 13, TEXT, 6, M, CW, 'bold');
  y += 1;
  paragraph('Converse com a OCA Digital: uma conversa de 30 minutos, sem custo, para transformar este diagnóstico em um plano de ação.', 10.5, MUTED, 5.2);
  y += 2;
  paragraph('ocadigital.com.br/contact   |   WhatsApp (48) 99679-0700', 10.5, PRIMARY, 5.2, M, CW, 'bold');

  // Rodapé em todas as páginas
  const pages = doc.getNumberOfPages();
  for (let p = 1; p <= pages; p++) {
    doc.setPage(p);
    draw(TRACK);
    doc.line(M, H - 17, W - M, H - 17);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    ink(MUTED);
    const foot = doc.splitTextToSize(
      'Estimativa baseada nas suas respostas. O modelo se inspira no CMMI e no MPS.BR e foi adaptado pela OCA Digital para a rotina de imobiliárias; não é uma certificação.',
      CW - 20,
    ) as string[];
    foot.forEach((ln, i) => doc.text(ln, M, H - 12 + i * 3.4));
    doc.text(`${p}/${pages}`, W - M, H - 12, { align: 'right' });
  }

  const file = `diagnostico-maturidade-imobiliaria-${slug(name) || 'oca-digital'}.pdf`;
  doc.save(file);
  return doc;
}
