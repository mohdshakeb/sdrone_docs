'use client';

import React, { useState } from 'react';
import Modal, { ModalListItem } from '@/components/ui/Modal';
import { useModal } from '@/components/ui/hooks/useModal';
import Button from '@/components/ui/Button';

// List-based modal example
export function ListModalExample() {
    const modal = useModal();
    const [selectedType, setSelectedType] = useState<string>('');

    const incidentTypes: ModalListItem[] = [
        { value: 'near-miss', label: 'Near Miss / Hazard' },
        { value: 'first-aid', label: 'First Aid' },
        { value: 'incident', label: 'First Incident Report' },
        { value: 'accident', label: 'Accident Detail Report' },
        { value: 'unsure', label: 'Not sure' },
    ];

    const handleConfirm = (value: string) => {
        setSelectedType(value);
        modal.close();
    };

    return (
        <div>
            <Button onClick={modal.open}>Report Incident</Button>
            {selectedType && (
                <p className="text-caption" style={{ marginTop: '12px', color: 'var(--fg-muted)' }}>
                    Selected: {incidentTypes.find(t => t.value === selectedType)?.label}
                </p>
            )}

            <Modal
                variant="list"
                isOpen={modal.isOpen}
                onClose={modal.close}
                title="What are you reporting?"
                items={incidentTypes}
                onConfirm={handleConfirm}
                confirmLabel="Continue"
            />
        </div>
    );
}

// Informational modal example
export function InfoModalExample() {
    const modal = useModal();

    return (
        <div>
            <Button onClick={modal.open} variant="secondary">View Guidelines</Button>

            <Modal
                variant="info"
                isOpen={modal.isOpen}
                onClose={modal.close}
                title="Safety Guidelines"
                dismissLabel="Got it"
            >
                <p className="text-body" style={{ marginBottom: '12px' }}>
                    All incidents must be reported within 24 hours of occurrence.
                    Use the incident report form to document details including location,
                    time, and involved parties.
                </p>
                <p className="text-body">
                    For emergencies, contact your supervisor immediately and follow
                    the emergency response procedures outlined in your safety manual.
                </p>
            </Modal>
        </div>
    );
}

// Action-based modal example (Delete confirmation)
export function ActionModalExample() {
    const modal = useModal();
    const [deleted, setDeleted] = useState(false);

    const handleDelete = () => {
        setDeleted(true);
        modal.close();
        // Reset after demonstration
        setTimeout(() => setDeleted(false), 3000);
    };

    return (
        <div>
            <Button onClick={modal.open} variant="negative">Delete Report</Button>
            {deleted && (
                <p className="text-caption" style={{ marginTop: '12px', color: 'var(--fg-muted)' }}>
                    Report deleted successfully
                </p>
            )}

            <Modal
                variant="action"
                isOpen={modal.isOpen}
                onClose={modal.close}
                title="Delete Report"
                onConfirm={handleDelete}
                confirmLabel="Delete"
                confirmVariant="negative"
            >
                <p className="text-body">
                    Are you sure you want to delete this report? This action cannot be undone.
                    All associated data will be permanently removed.
                </p>
            </Modal>
        </div>
    );
}

// Size variants example
export function SizeVariantsExample() {
    const smallModal = useModal();
    const mediumModal = useModal();
    const largeModal = useModal();

    return (
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <Button onClick={smallModal.open} variant="secondary" size="sm">
                Small Modal
            </Button>
            <Button onClick={mediumModal.open} variant="secondary" size="sm">
                Medium Modal
            </Button>
            <Button onClick={largeModal.open} variant="secondary" size="sm">
                Large Modal
            </Button>

            <Modal
                variant="info"
                isOpen={smallModal.isOpen}
                onClose={smallModal.close}
                title="Small Modal"
                size="sm"
            >
                <p className="text-body">This is a small modal (400px max-width).</p>
            </Modal>

            <Modal
                variant="info"
                isOpen={mediumModal.isOpen}
                onClose={mediumModal.close}
                title="Medium Modal"
                size="md"
            >
                <p className="text-body">This is a medium modal (560px max-width). This is the default size.</p>
            </Modal>

            <Modal
                variant="info"
                isOpen={largeModal.isOpen}
                onClose={largeModal.close}
                title="Large Modal"
                size="lg"
            >
                <p className="text-body">This is a large modal (720px max-width). Use this for content that needs more horizontal space.</p>
            </Modal>
        </div>
    );
}

// List with disabled items
export function DisabledItemsExample() {
    const modal = useModal();
    const [selectedValue, setSelectedValue] = useState<string>('');

    const statusOptions: ModalListItem[] = [
        { value: 'draft', label: 'Draft' },
        { value: 'pending', label: 'Pending Review' },
        { value: 'approved', label: 'Approved', disabled: true },
        { value: 'rejected', label: 'Rejected', disabled: true },
        { value: 'archived', label: 'Archived' },
    ];

    const handleConfirm = (value: string) => {
        setSelectedValue(value);
        modal.close();
    };

    return (
        <div>
            <Button onClick={modal.open} variant="secondary">Change Status</Button>
            {selectedValue && (
                <p className="text-caption" style={{ marginTop: '12px', color: 'var(--fg-muted)' }}>
                    Selected: {statusOptions.find(s => s.value === selectedValue)?.label}
                </p>
            )}

            <Modal
                variant="list"
                isOpen={modal.isOpen}
                onClose={modal.close}
                title="Select Status"
                items={statusOptions}
                onConfirm={handleConfirm}
            />
        </div>
    );
}

// Scrollable content example
export function ScrollableContentExample() {
    const modal = useModal();

    const longContent = Array.from({ length: 20 }, (_, i) => (
        <p key={i} className="text-body" style={{ marginBottom: '12px' }}>
            Paragraph {i + 1}: This is sample content to demonstrate scrollable behavior
            in modals. When content exceeds the available viewport height, the modal
            body becomes scrollable while keeping the header and footer fixed.
        </p>
    ));

    return (
        <div>
            <Button onClick={modal.open} variant="secondary">View Terms</Button>

            <Modal
                variant="info"
                isOpen={modal.isOpen}
                onClose={modal.close}
                title="Terms and Conditions"
                dismissLabel="I Agree"
            >
                {longContent}
            </Modal>
        </div>
    );
}

// Long list example
export function LongListExample() {
    const modal = useModal();
    const [selectedValue, setSelectedValue] = useState<string>('');

    const countries: ModalListItem[] = [
        { value: 'us', label: 'United States' },
        { value: 'ca', label: 'Canada' },
        { value: 'mx', label: 'Mexico' },
        { value: 'uk', label: 'United Kingdom' },
        { value: 'fr', label: 'France' },
        { value: 'de', label: 'Germany' },
        { value: 'it', label: 'Italy' },
        { value: 'es', label: 'Spain' },
        { value: 'nl', label: 'Netherlands' },
        { value: 'be', label: 'Belgium' },
        { value: 'ch', label: 'Switzerland' },
        { value: 'au', label: 'Australia' },
        { value: 'nz', label: 'New Zealand' },
        { value: 'jp', label: 'Japan' },
        { value: 'cn', label: 'China' },
    ];

    const handleConfirm = (value: string) => {
        setSelectedValue(value);
        modal.close();
    };

    return (
        <div>
            <Button onClick={modal.open} variant="secondary">Select Country</Button>
            {selectedValue && (
                <p className="text-caption" style={{ marginTop: '12px', color: 'var(--fg-muted)' }}>
                    Selected: {countries.find(c => c.value === selectedValue)?.label}
                </p>
            )}

            <Modal
                variant="list"
                isOpen={modal.isOpen}
                onClose={modal.close}
                title="Select Your Country"
                items={countries}
                onConfirm={handleConfirm}
            />
        </div>
    );
}
