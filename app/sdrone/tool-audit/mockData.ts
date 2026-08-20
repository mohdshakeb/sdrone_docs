/**
 * Mock data for tool audit form
 */

import type { AuditType, ToolChecklistEntry } from './types';
import type { BadgeColor } from '@/components/ui/Badge';
import { MOCK_EMPLOYEES } from '@/data/mock-data';

// Audit type options for Select
export const auditTypeOptions = [
    { value: 'etb', label: 'ETB' },
    { value: 'bcp-gci', label: 'BCP / GCI' },
    { value: 'workshop', label: 'Workshop' },
    { value: 'rigging', label: 'Rigging & Lifting' },
];

// Location options (reuse same sites as incident report)
export const locationOptions = [
    { value: 'site-a', label: 'Site A - Main Facility' },
    { value: 'site-b', label: 'Site B - Warehouse' },
    { value: 'site-c', label: 'Site C - Office Complex' },
    { value: 'site-d', label: 'Site D - Manufacturing Plant' },
    { value: 'site-e', label: 'Site E - Distribution Center' },
];

// Tool definition (before adding to checklist)
interface ToolDefinition {
    toolId: string;
    toolName: string;
    specification: string;
    checkpoint: string;
}

// Tool sets by audit type
const toolSetsByAuditType: Record<AuditType, ToolDefinition[]> = {
    'etb': [
        { toolId: 'etb-1', toolName: 'Multimeter (Digital)', specification: 'CAT III 600V rated', checkpoint: 'Display readable, leads intact, calibration current' },
        { toolId: 'etb-2', toolName: 'Insulation Tester', specification: '1000V DC test voltage', checkpoint: 'Battery charged, test leads undamaged, zero check passes' },
        { toolId: 'etb-3', toolName: 'Cable Cutter', specification: 'Rated for 35mm\u00B2 copper', checkpoint: 'Blades sharp, handles insulated, pivot bolt tight' },
        { toolId: 'etb-4', toolName: 'Wire Stripper Set', specification: 'Adjustable 0.5\u20136mm\u00B2', checkpoint: 'Jaws aligned, spring intact, sizes legible' },
        { toolId: 'etb-5', toolName: 'Crimping Tool', specification: 'Ratchet type, 0.5\u201310mm\u00B2', checkpoint: 'Ratchet mechanism functional, dies matched, no deformation' },
        { toolId: 'etb-6', toolName: 'Voltage Detector (Non-Contact)', specification: '12V\u20131000V AC', checkpoint: 'Self-test passes, indicator LED functional, battery level adequate' },
        { toolId: 'etb-7', toolName: 'Torque Screwdriver Set', specification: '1\u20135 Nm range', checkpoint: 'Calibration label current, bits intact, click mechanism audible' },
        { toolId: 'etb-8', toolName: 'Earth Continuity Tester', specification: 'Per BS 7671', checkpoint: 'Leads undamaged, null reading \u22640.05\u03A9, test passes' },
    ],
    'bcp-gci': [
        { toolId: 'bcp-1', toolName: 'Pressure Gauge (2\u00BD")', specification: '0\u2013400 bar, glycerine filled', checkpoint: 'Calibration current, lens intact, pointer returns to zero' },
        { toolId: 'bcp-2', toolName: 'Quick Coupler with 4 MTS Hose', specification: 'Rated 350 bar WP', checkpoint: 'O-rings intact, no leaks under pressure, locking mechanism secure' },
        { toolId: 'bcp-3', toolName: 'Test Hose', specification: '\u00BC" ID, 700 bar burst', checkpoint: 'No kinks or abrasion, fittings tight, pressure-tested' },
        { toolId: 'bcp-4', toolName: 'Hydraulic Hose Assembly', specification: 'SAE 100R2AT, 6\u201312mm ID', checkpoint: 'No cracks in cover, fittings torqued, bend radius maintained' },
        { toolId: 'bcp-5', toolName: 'Socket Set (\u00BD" Sq Drive \u2013 Metric)', specification: '10\u201332mm, Cr-V steel', checkpoint: 'All sizes present, no rounding, ratchet clicks positive' },
        { toolId: 'bcp-6', toolName: 'Torque Wrench', specification: '40\u2013200 Nm, \u00BD" drive', checkpoint: 'Calibration label current, click mechanism functional, handle undamaged' },
        { toolId: 'bcp-7', toolName: 'Safety Lock Pins', specification: 'Grade 8.8, zinc plated', checkpoint: 'No corrosion, split pins straight, correct size for application' },
        { toolId: 'bcp-8', toolName: 'Allen Key Set', specification: '1.5\u201310mm, L-type, Cr-V', checkpoint: 'All sizes present, no rounding, no bending' },
        { toolId: 'bcp-9', toolName: 'Measuring Tape (Calibrated)', specification: '5m, Class II accuracy', checkpoint: 'Calibration current, tape retracts, lock functional' },
        { toolId: 'bcp-10', toolName: 'Hand Sledge Hammer', specification: '1.5 kg head, fibreglass handle', checkpoint: 'Head secure, handle no cracks, striking face undamaged' },
    ],
    'workshop': [
        { toolId: 'ws-1', toolName: 'Bench Vice', specification: '150mm jaw width, hardened faces', checkpoint: 'Jaws aligned, screw smooth, mounting bolts tight' },
        { toolId: 'ws-2', toolName: 'Angle Grinder', specification: '125mm disc, 850W', checkpoint: 'Guard present, disc undamaged, power cord intact, switch functional' },
        { toolId: 'ws-3', toolName: 'Bench Grinder', specification: '200mm wheels, \u00BE HP', checkpoint: 'Eye shields present, tool rest gap \u22643mm, wheels dressed' },
        { toolId: 'ws-4', toolName: 'Drill Press', specification: '16mm chuck, 12-speed', checkpoint: 'Chuck key removed, belt guard closed, table secure, depth stop functional' },
        { toolId: 'ws-5', toolName: 'Vernier Caliper (Digital)', specification: '0\u2013150mm, 0.01mm resolution', checkpoint: 'Zero calibrated, jaws undamaged, battery level adequate' },
        { toolId: 'ws-6', toolName: 'Combination Spanner Set', specification: '6\u201332mm, Cr-V', checkpoint: 'All sizes present, no rounding, no cracking' },
        { toolId: 'ws-7', toolName: 'Hydraulic Press', specification: '20-tonne, manual pump', checkpoint: 'Ram seals intact, gauge functional, safety guard in place' },
        { toolId: 'ws-8', toolName: 'Welding Machine (MIG)', specification: '250A, CO\u2082/Ar mix', checkpoint: 'Earth clamp secure, torch tip clean, wire feed smooth, gas flow tested' },
    ],
    'rigging': [
        { toolId: 'rig-1', toolName: 'Chain Block (Lever Hoist)', specification: '3-tonne rated, Grade 80 chain', checkpoint: 'Chain no kinks/wear, hooks undamaged, latch springs functional, load test tag current' },
        { toolId: 'rig-2', toolName: 'Wire Rope Sling', specification: '6\u00d719 construction, 2-tonne WLL', checkpoint: 'No broken wires, no kinks, ferrules/end fittings intact, WLL tag legible' },
        { toolId: 'rig-3', toolName: 'Polyester Round Sling', specification: '2-tonne WLL, EN 1492-2', checkpoint: 'No cuts or abrasion, label readable, colour-code intact, no chemical damage' },
        { toolId: 'rig-4', toolName: 'Bow Shackle Set', specification: 'Grade S, 1\u20135 tonne WLL', checkpoint: 'Pins fully seated, no deformation, WLL stamped, safety wire fitted' },
        { toolId: 'rig-5', toolName: 'D-Shackle Set', specification: 'Grade S, 1\u20133.25 tonne WLL', checkpoint: 'Pins fully seated, no deformation or cracks, WLL stamped, safety wire fitted' },
        { toolId: 'rig-6', toolName: 'Lifting Eye Bolt Set', specification: 'M12\u2013M24, Grade 8.8', checkpoint: 'Full thread engagement, no deformation, rated WLL visible, shoulder seated flush' },
        { toolId: 'rig-7', toolName: 'Safety Hook with Latch', specification: '1-tonne WLL, swivel type', checkpoint: 'Latch spring snaps closed, pin undamaged, no opening deformation, inspection tag current' },
        { toolId: 'rig-8', toolName: 'Spreader Beam', specification: '2-tonne SWL, adjustable 1\u20133 m', checkpoint: 'Pin holes undamaged, length markings legible, SWL plate intact, no visible cracks' },
    ],
};

/**
 * Generate checklist entries from tool definitions for a given audit type
 */
export function getToolChecklistForType(auditType: AuditType): ToolChecklistEntry[] {
    const definitions = toolSetsByAuditType[auditType] ?? [];
    return definitions.map((def) => ({
        toolId: def.toolId,
        toolName: def.toolName,
        specification: def.specification,
        checkpoint: def.checkpoint,
        condition: null,
        remarks: '',
        images: [],
    }));
}

// Audit type display labels
export const auditTypeLabels: Record<string, string> = {
    'etb': 'ETB',
    'bcp-gci': 'BCP / GCI',
    'workshop': 'Workshop',
    'rigging': 'Rigging & Lifting',
};

// CSE name options from employee roster
export const cseNameOptions = MOCK_EMPLOYEES.map(emp => ({ value: emp.id, label: emp.name }));

// Audit type badge colors
export const auditTypeBadgeColors: Record<string, BadgeColor> = {
    'etb': 'information',
    'bcp-gci': 'positive',
    'workshop': 'notice',
    'rigging': 'neutral',
};
