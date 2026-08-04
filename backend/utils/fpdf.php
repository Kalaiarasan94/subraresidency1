<?php
/*******************************************************************************
* FPDF - Free PDF generator library for PHP                                    *
* Version: 1.86 (Standalone Light Edition for Subra Residency Invoices)        *
*******************************************************************************/

class FPDF {
    protected $page;               // current page number
    protected $n;                  // current object number
    protected $offsets;            // array of object offsets
    protected $buffer;             // buffer holding in-memory PDF
    protected $pages;              // array containing pages
    protected $state;              // current document state
    protected $compress;           // compression flag
    protected $k;                  // scale factor (number of points in user unit)
    protected $defOrientation;     // default orientation
    protected $curOrientation;     // current orientation
    protected $PageSizes;          // used for custom sizes
    protected $defPageSize;        // default page size
    protected $curPageSize;        // current page size
    protected $wPg, $hPg;          // current page dimensions
    protected $w, $h;              // current page dimensions (user units)
    protected $lMargin;            // left margin
    protected $tMargin;            // top margin
    protected $rMargin;            // right margin
    protected $bMargin;            // page break margin
    protected $cMargin;            // cell margin
    protected $x, $y;              // current position in user units
    protected $lasth;              // height of last printed cell
    protected $LineWidth;          // line width in user units
    protected $fontpath;           // path containing fonts
    protected $CoreFonts;          // array of core font names
    protected $fonts;              // array of used fonts
    protected $FontFiles;          // array of font files
    protected $diffs;              // array of encoding differences
    protected $FontFamily;         // current font family
    protected $FontStyle;          // current font style
    protected $underline;          // underlining flag
    protected $CurrentFont;        // current font info
    protected $FontSizePt;         // current font size in points
    protected $FontSize;           // current font size in user units
    protected $DrawColor;          // commands for drawing color
    protected $FillColor;          // commands for filling color
    protected $TextColor;          // commands for text color
    protected $ColorFlag;          // whether color has changed
    protected $AutoPageBreak;      // automatic page breaking
    protected $PageBreakTrigger;   // threshold to trigger page break
    protected $InHeader;           // flag set when processing header
    protected $InFooter;           // flag set when processing footer
    protected $ZoomMode;           // zoom display mode
    protected $LayoutMode;         // layout display mode
    protected $metadata;           // document properties
    protected $PDFVersion;         // PDF version number

    public function __construct($orientation='P', $unit='mm', $size='A4') {
        $this->state = 0;
        $this->page = 0;
        $this->n = 2;
        $this->buffer = '';
        $this->pages = array();
        $this->PageSizes = array();
        $this->fonts = array();
        $this->FontFiles = array();
        $this->diffs = array();
        $this->offsets = array();
        $this->compress = true;
        $this->LineWidth = 0.567 / 2.8346456692913;
        $this->CoreFonts = array('courier', 'helvetica', 'times', 'symbol', 'zapfdingbats');
        
        // Scale factor
        if ($unit == 'pt') $this->k = 1;
        elseif ($unit == 'mm') $this->k = 72 / 25.4;
        elseif ($unit == 'cm') $this->k = 72 / 2.54;
        elseif ($unit == 'in') $this->k = 72;
        else $this->Error('Incorrect unit: '.$unit);

        // Page size
        $this->PageSizes['a4'] = array(595.28, 841.89);
        $this->PageSizes['letter'] = array(612, 792);
        $size = $this->_getpagesize($size);
        $this->defPageSize = $size;
        $this->curPageSize = $size;

        // Orientation
        $orientation = strtolower($orientation);
        if ($orientation == 'p' || $orientation == 'portrait') {
            $this->defOrientation = 'P';
            $this->w = $size[0];
            $this->h = $size[1];
        } elseif ($orientation == 'l' || $orientation == 'landscape') {
            $this->defOrientation = 'L';
            $this->w = $size[1];
            $this->h = $size[0];
        } else {
            $this->Error('Incorrect orientation: '.$orientation);
        }
        $this->curOrientation = $this->defOrientation;
        $this->wPg = $this->w;
        $this->hPg = $this->h;

        // Margins
        $margin = 28.35 / $this->k; // 10 mm
        $this->SetMargins($margin, $margin);
        $this->cMargin = $margin / 10;
        $this->bMargin = 2 * $margin;
        $this->SetAutoPageBreak(true, $this->bMargin);

        // Colors
        $this->DrawColor = '0 G';
        $this->FillColor = '0 g';
        $this->TextColor = '0 g';
        $this->ColorFlag = false;

        // Font defaults
        $this->FontFamily = '';
        $this->FontStyle = '';
        $this->FontSizePt = 12;
        $this->FontSize = 12 / $this->k;

        $this->PDFVersion = '1.3';
    }

    public function SetMargins($left, $top, $right=null) {
        $this->lMargin = $left;
        $this->tMargin = $top;
        if ($right === null) $right = $left;
        $this->rMargin = $right;
    }

    public function SetAutoPageBreak($auto, $margin=0) {
        $this->AutoPageBreak = $auto;
        $this->bMargin = $margin;
        $this->PageBreakTrigger = $this->h - $margin;
    }

    public function AddPage($orientation='', $size='', $rotation=0) {
        if ($this->state == 0) $this->Open();
        $family = $this->FontFamily;
        $style = $this->FontStyle . ($this->underline ? 'U' : '');
        $fontsize = $this->FontSizePt;

        if ($this->page > 0) {
            $this->_endpage();
        }

        $this->_beginpage($orientation, $size, $rotation);
        $this->_out('2 J'); // Line cap
        $this->LineWidth = 0.2 / $this->k;
        $this->_out(sprintf('%.2F w', $this->LineWidth * $this->k));

        if ($family) $this->SetFont($family, $style, $fontsize);

        $this->SetDrawColor(0);
        $this->SetFillColor(255);
        $this->SetTextColor(0);
    }

    public function Open() {
        $this->state = 1;
    }

    public function SetFont($family, $style='', $size=0) {
        $family = strtolower($family);
        if ($family == '') $family = $this->FontFamily;
        if ($family == 'arial') $family = 'helvetica';
        
        $style = strtoupper($style);
        if (strpos($style, 'U') !== false) {
            $this->underline = true;
            $style = str_replace('U', '', $style);
        } else {
            $this->underline = false;
        }
        if ($style == 'IB') $style = 'BI';

        if ($size == 0) $size = $this->FontSizePt;

        if ($this->FontFamily == $family && $this->FontStyle == $style && $this->FontSizePt == $size) return;

        $fontkey = $family . $style;
        if (!isset($this->fonts[$fontkey])) {
            $this->fonts[$fontkey] = array('i' => count($this->fonts) + 1, 'type' => 'core', 'name' => $this->_getcorefontname($family, $style), 'up' => -100, 'ut' => 50);
        }

        $this->FontFamily = $family;
        $this->FontStyle = $style;
        $this->FontSizePt = $size;
        $this->FontSize = $size / $this->k;
        $this->CurrentFont = &$this->fonts[$fontkey];

        if ($this->page > 0) {
            $this->_out(sprintf('BT /F%d %.2F Tf ET', $this->CurrentFont['i'], $this->FontSizePt));
        }
    }

    public function SetFontSize($size) {
        if ($this->FontSizePt == $size) return;
        $this->FontSizePt = $size;
        $this->FontSize = $size / $this->k;
        if ($this->page > 0) {
            $this->_out(sprintf('BT /F%d %.2F Tf ET', $this->CurrentFont['i'], $this->FontSizePt));
        }
    }

    public function SetDrawColor($r, $g=null, $b=null) {
        if (($r == 0 && $g == 0 && $b == 0) || $g === null) {
            $this->DrawColor = sprintf('%.3F G', $r / 255);
        } else {
            $this->DrawColor = sprintf('%.3F %.3F %.3F RG', $r / 255, $g / 255, $b / 255);
        }
        if ($this->page > 0) $this->_out($this->DrawColor);
    }

    public function SetLineWidth($width) {
        $this->LineWidth = $width;
        if ($this->page > 0) $this->_out(sprintf('%.2F w', $width * $this->k));
    }

    public function SetFillColor($r, $g=null, $b=null) {
        if (($r == 0 && $g == 0 && $b == 0) || $g === null) {
            $this->FillColor = sprintf('%.3F g', $r / 255);
        } else {
            $this->FillColor = sprintf('%.3F %.3F %.3F rg', $r / 255, $g / 255, $b / 255);
        }
        $this->ColorFlag = ($this->FillColor != $this->TextColor);
        if ($this->page > 0) $this->_out($this->FillColor);
    }

    public function SetTextColor($r, $g=null, $b=null) {
        if (($r == 0 && $g == 0 && $b == 0) || $g === null) {
            $this->TextColor = sprintf('%.3F g', $r / 255);
        } else {
            $this->TextColor = sprintf('%.3F %.3F %.3F rg', $r / 255, $g / 255, $b / 255);
        }
        $this->ColorFlag = ($this->FillColor != $this->TextColor);
    }

    public function GetStringWidth($s) {
        $s = (string)$s;
        $cw = array(
            ' '=>278,'!'=>278,'"'=>355,'#'=>556,'$'=>556,'%'=>889,'&'=>667,'\''=>191,'('=>333,')'=>333,'*'=>389,'+'=>584,','=>278,'-'=>333,'.'=>278,'/'=>278,
            '0'=>556,'1'=>556,'2'=>556,'3'=>556,'4'=>556,'5'=>556,'6'=>556,'7'=>556,'8'=>556,'9'=>556,':'=>278,';'=>278,'<'=>584,'='=>584,'>'=>584,'?'=>556,
            '@'=>1015,'A'=>667,'B'=>667,'C'=>722,'D'=>722,'E'=>667,'F'=>611,'G'=>778,'H'=>722,'I'=>278,'J'=>500,'K'=>667,'L'=>556,'M'=>833,'N'=>722,'O'=>778,
            'P'=>667,'Q'=>778,'R'=>722,'S'=>667,'T'=>667,'U'=>722,'V'=>667,'W'=>944,'X'=>667,'Y'=>667,'Z'=>611,'['=>333,'\\'=>278,']'=>333,'^'=>469,'_'=>556,
            '`'=>333,'a'=>556,'b'=>556,'c'=>500,'d'=>556,'e'=>556,'f'=>278,'g'=>556,'h'=>556,'i'=>222,'j'=>222,'k'=>500,'l'=>222,'m'=>833,'n'=>556,'o'=>556,
            'p'=>556,'q'=>556,'r'=>333,'s'=>500,'t'=>278,'u'=>556,'v'=>500,'w'=>722,'x'=>500,'y'=>500,'z'=>500,'{'=>334,'|'=>260,'}'=>334,'~'=>584
        );
        $l = 0;
        $len = strlen($s);
        for ($i=0; $i<$len; $i++) {
            $c = $s[$i];
            $l += isset($cw[$c]) ? $cw[$c] : 500;
        }
        return $l * $this->FontSize / 1000;
    }

    public function GetX() {
        return $this->x;
    }

    public function GetY() {
        return $this->y;
    }

    public function SetX($x) {
        if ($x >= 0) $this->x = $x;
        else $this->x = $this->w + $x;
    }

    public function SetY($y) {
        $this->x = $this->lMargin;
        if ($y >= 0) $this->y = $y;
        else $this->y = $this->h + $y;
    }

    public function SetXY($x, $y) {
        $this->SetY($y);
        $this->SetX($x);
    }

    public function AcceptPageBreak() {
        return $this->AutoPageBreak;
    }

    public function MultiCell($w, $h, $txt, $border=0, $align='L', $fill=false) {
        if ($w == 0) $w = $this->w - $this->rMargin - $this->x;
        $lines = explode("\n", $txt);
        foreach ($lines as $line) {
            $this->Cell($w, $h, $line, $border, 1, $align, $fill);
        }
    }

    public function Cell($w, $h=0, $txt='', $border=0, $ln=0, $align='', $fill=false, $link='') {
        $k = $this->k;
        if ($this->y + $h > $this->PageBreakTrigger && !$this->InHeader && !$this->InFooter && $this->AcceptPageBreak()) {
            $x = $this->x;
            $ws = $this->ws;
            if ($ws > 0) {
                $this->ws = 0;
                $this->_out('0 Tw');
            }
            $this->AddPage($this->curOrientation, $this->curPageSize);
            $this->x = $x;
            if ($ws > 0) {
                $this->ws = $ws;
                $this->_out(sprintf('%.3F Tw', $ws * $k));
            }
        }
        if ($w == 0) $w = $this->w - $this->rMargin - $this->x;

        $s = '';
        if ($fill || $border == 1) {
            if ($fill) $op = ($border == 1) ? 'B*' : 'f*';
            else $op = 'S';
            $s = sprintf('%.2F %.2F %.2F %.2F re %s ', $this->x * $k, ($this->h - $this->y) * $k, $w * $k, -$h * $k, $op);
        }

        if (is_string($border)) {
            $x = $this->x;
            $y = $this->y;
            if (strpos($border, 'L') !== false) $s .= sprintf('%.2F %.2F m %.2F %.2F l S ', $x * $k, ($this->h - $y) * $k, $x * $k, ($this->h - ($y + $h)) * $k);
            if (strpos($border, 'T') !== false) $s .= sprintf('%.2F %.2F m %.2F %.2F l S ', $x * $k, ($this->h - $y) * $k, ($x + $w) * $k, ($this->h - $y) * $k);
            if (strpos($border, 'R') !== false) $s .= sprintf('%.2F %.2F m %.2F %.2F l S ', ($x + $w) * $k, ($this->h - $y) * $k, ($x + $w) * $k, ($this->h - ($y + $h)) * $k);
            if (strpos($border, 'B') !== false) $s .= sprintf('%.2F %.2F m %.2F %.2F l S ', $x * $k, ($this->h - ($y + $h)) * $k, ($x + $w) * $k, ($this->h - ($y + $h)) * $k);
        }

        if ($txt !== '') {
            if ($align == 'R') $dx = $w - $this->cMargin - $this->GetStringWidth($txt);
            elseif ($align == 'C') $dx = ($w - $this->GetStringWidth($txt)) / 2;
            else $dx = $this->cMargin;

            if ($this->ColorFlag) $s .= 'q ' . $this->TextColor . ' ';
            $txt2 = str_replace(')', '\\)', str_replace('(', '\\(', str_replace('\\', '\\\\', $txt)));
            $fontIdx = isset($this->CurrentFont['i']) ? $this->CurrentFont['i'] : 1;
            $s .= sprintf('BT /F%d %.2F Tf %.2F %.2F Td (%s) Tj ET', $fontIdx, $this->FontSizePt, ($this->x + $dx) * $k, ($this->h - ($this->y + .5 * $h + .3 * $this->FontSize)) * $k, $txt2);
            if ($this->ColorFlag) $s .= ' Q';
        }

        $this->lasth = $h;
        if ($s) $this->_out($s);

        if ($ln > 0) {
            $this->y += $h;
            if ($ln == 1) $this->x = $this->lMargin;
        } else {
            $this->x += $w;
        }
    }

    public function Ln($h=null) {
        $this->x = $this->lMargin;
        if ($h === null) $this->y += $this->lasth;
        else $this->y += $h;
    }

    public function Line($x1, $y1, $x2, $y2) {
        $this->_out(sprintf('%.2F %.2F m %.2F %.2F l S', $x1 * $this->k, ($this->h - $y1) * $this->k, $x2 * $this->k, ($this->h - $y2) * $this->k));
    }

    public function Rect($x, $y, $w, $h, $style='') {
        if ($style == 'F') $op = 'f';
        elseif ($style == 'FD' || $style == 'DF') $op = 'B';
        else $op = 'S';
        $this->_out(sprintf('%.2F %.2F %.2F %.2F re %s', $x * $this->k, ($this->h - $y) * $this->k, $w * $this->k, -$h * $this->k, $op));
    }

    public function Output($dest='', $name='') {
        if ($this->state < 3) {
            $this->_enddoc();
        }
        return $this->buffer;
    }

    protected function _getpagesize($size) {
        if (is_string($size)) {
            $size = strtolower($size);
            if (isset($this->PageSizes[$size])) return $this->PageSizes[$size];
            else $this->Error('Unknown page size: '.$size);
        } else {
            return array($size[0] * $this->k, $size[1] * $this->k);
        }
    }

    protected function _beginpage($orientation, $size, $rotation) {
        $this->page++;
        $this->pages[$this->page] = '';
        $this->state = 2;
        $this->x = $this->lMargin;
        $this->y = $this->tMargin;
        $this->FontFamily = '';
    }

    protected function _endpage() {
        $this->state = 1;
    }

    protected function _out($s) {
        if ($this->state == 2) $this->pages[$this->page] .= $s . "\n";
        else $this->buffer .= $s . "\n";
    }

    protected function _enddoc() {
        $this->state = 3;
        $this->_putheader();
        $this->_putpages();
        $this->_putresources();
        $this->_putinfo();
        $this->_putcatalog();
        $this->_putcrossref();
        $this->_puttrailer();
    }

    protected function _putheader() {
        $this->_out('%PDF-' . $this->PDFVersion);
    }

    protected function _putpages() {
        $nb = $this->page;
        // Object 1: /Type /Pages
        // Page objects: Object 2 to 1 + nb
        // Content objects: Object 2 + nb to 1 + 2*nb
        // Resource object: Object 2 + 2*nb

        for ($n = 1; $n <= $nb; $n++) {
            $pageObj = 1 + $n;
            $contentObj = 1 + $nb + $n;
            $resourceObj = 2 + 2 * $nb;
            
            $this->offsets[$pageObj] = strlen($this->buffer);
            $this->_out($pageObj . ' 0 obj');
            $this->_out('<</Type /Page');
            $this->_out('/Parent 1 0 R');
            $this->_out(sprintf('/MediaBox [0 0 %.2F %.2F]', $this->wPg, $this->hPg));
            $this->_out('/Resources ' . $resourceObj . ' 0 R');
            $this->_out('/Contents ' . $contentObj . ' 0 R>>');
            $this->_out('endobj');
        }

        for ($n = 1; $n <= $nb; $n++) {
            $contentObj = 1 + $nb + $n;
            $p = $this->pages[$n];
            $this->offsets[$contentObj] = strlen($this->buffer);
            $this->_out($contentObj . ' 0 obj');
            $this->_out('<</Length ' . strlen($p) . '>>');
            $this->_out('stream');
            $this->_out($p);
            $this->_out('endstream');
            $this->_out('endobj');
        }

        // Object 1: /Type /Pages
        $this->offsets[1] = strlen($this->buffer);
        $this->_out('1 0 obj');
        $this->_out('<</Type /Pages');
        $kids = '/Kids [';
        for ($i = 1; $i <= $nb; $i++) $kids .= (1 + $i) . ' 0 R ';
        $this->_out($kids . ']');
        $this->_out('/Count ' . $nb);
        $this->_out('>>');
        $this->_out('endobj');
    }

    protected function _putresources() {
        $nbPages = count($this->pages);
        $resourceObj = 2 + 2 * $nbPages;
        $this->offsets[$resourceObj] = strlen($this->buffer);
        $this->_out($resourceObj . ' 0 obj');
        $this->_out('<</ProcSet [/PDF /Text /ImageB /ImageC /ImageI]');
        $this->_out('/Font <<');
        
        $fontObjStart = $resourceObj;
        foreach ($this->fonts as $font) {
            $fontObjStart++;
            $this->_out('/F' . $font['i'] . ' ' . $fontObjStart . ' 0 R');
        }
        $this->_out('>> >>');
        $this->_out('endobj');

        $fontObjStart = $resourceObj;
        foreach ($this->fonts as $font) {
            $fontObjStart++;
            $this->offsets[$fontObjStart] = strlen($this->buffer);
            $this->_out($fontObjStart . ' 0 obj');
            $this->_out('<</Type /Font');
            $this->_out('/Subtype /Type1');
            $this->_out('/BaseFont /' . $font['name']);
            $this->_out('/Encoding /WinAnsiEncoding');
            $this->_out('>>');
            $this->_out('endobj');
        }
    }

    protected function _putinfo() {
        $this->_out('/Producer (Subra Residency PDF Engine)');
        $this->_out('/CreationDate (D:' . date('YmdHis') . ')');
    }

    protected function _putcatalog() {
        $catalogObj = count($this->offsets) + 1;
        $this->offsets[$catalogObj] = strlen($this->buffer);
        $this->_out($catalogObj . ' 0 obj');
        $this->_out('<</Type /Catalog');
        $this->_out('/Pages 1 0 R>>');
        $this->_out('endobj');
    }

    protected function _putcrossref() {
        $this->_out('xref');
        $this->_out('0 ' . (count($this->offsets) + 1));
        $this->_out('0000000000 65535 f ');
        for ($i = 1; $i <= count($this->offsets); $i++) {
            $off = isset($this->offsets[$i]) ? $this->offsets[$i] : 0;
            $this->_out(sprintf('%010d 00000 n ', $off));
        }
    }

    protected function _puttrailer() {
        $this->_out('trailer');
        $this->_out('<</Size ' . (count($this->offsets) + 1));
        $this->_out('/Root ' . count($this->offsets) . ' 0 R>>');
        $this->_out('startxref');
        $this->_out(strlen($this->buffer));
        $this->_out('%%EOF');
    }

    protected function _getcorefontname($family, $style) {
        if ($family == 'helvetica' || $family == 'arial') {
            if ($style == 'B') return 'Helvetica-Bold';
            if ($style == 'I') return 'Helvetica-Oblique';
            if ($style == 'BI') return 'Helvetica-BoldOblique';
            return 'Helvetica';
        }
        if ($family == 'times') {
            if ($style == 'B') return 'Times-Bold';
            if ($style == 'I') return 'Times-Italic';
            if ($style == 'BI') return 'Times-BoldItalic';
            return 'Times-Roman';
        }
        if ($family == 'courier') {
            if ($style == 'B') return 'Courier-Bold';
            if ($style == 'I') return 'Courier-Oblique';
            if ($style == 'BI') return 'Courier-BoldOblique';
            return 'Courier';
        }
        return 'Helvetica';
    }

    protected function Error($msg) {
        throw new Exception("FPDF error: $msg");
    }
}
?>
