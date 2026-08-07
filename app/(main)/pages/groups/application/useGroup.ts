'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { Toast } from 'primereact/toast';

import { Message } from '@/app/components/Message';

import { Group, createEmptyGroup } from '../domain/group';
import { groupService } from './group.service';

export function useGroup() {
    const toast = useRef<Toast>(null);

    const [groups, setGroups] = useState<Group[]>([]);
    const [selectedGroup, setSelectedGroup] = useState(createEmptyGroup());

    const [dialogVisible, setDialogVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    const loadGroups = useCallback(async () => {
        try {
            setLoading(true);

            const result = await groupService.findAll();

            setGroups(result);
        } catch (error) {
            console.error('Erro ao carregar grupos:', error);

            toast.current?.show({
                severity: 'error',
                summary: Message.errorMsg,
                detail: Message.errorLoad,
                life: 5000
            });
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void loadGroups();
    }, [loadGroups]);

    const openNew = () => {
        setSelectedGroup(createEmptyGroup());
        setDialogVisible(true);
    };

    const openEdit = (group: Group) => {
        setSelectedGroup({
            ...group
        });

        setDialogVisible(true);
    };

    const closeDialog = () => {
        setDialogVisible(false);
        setSelectedGroup(createEmptyGroup());
    };

    const save = async (group: Group) => {
        try {
            setSaving(true);

            if (group.id) {
                await groupService.update(group);
            } else {
                await groupService.create(group);
            }

            toast.current?.show({
                severity: 'success',
                summary: Message.successMsg,
                detail: Message.successSave,
                life: 3000
            });

            closeDialog();
            await loadGroups();
        } catch (error) {
            console.error('Erro ao salvar grupo:', error);

            toast.current?.show({
                severity: 'error',
                summary: Message.errorMsg,
                detail: Message.errorSave,
                life: 5000
            });
        } finally {
            setSaving(false);
        }
    };

    const remove = async (group: Group) => {
        if (!group.id) {
            toast.current?.show({
                severity: 'error',
                summary: Message.errorMsg,
                detail: 'Não foi possível excluir o grupo.',
                life: 5000
            });

            return;
        }

        try {
            setLoading(true);

            await groupService.remove(group.id);

            toast.current?.show({
                severity: 'success',
                summary: Message.successMsg,
                detail: Message.successDelete,
                life: 3000
            });

            await loadGroups();
        } catch (error) {
            console.error('Erro ao excluir grupo:', error);

            toast.current?.show({
                severity: 'error',
                summary: Message.errorMsg,
                detail: Message.errorDelete,
                life: 5000
            });
        } finally {
            setLoading(false);
        }
    };

    return {
        groups,
        selectedGroup,

        dialogVisible,
        loading,
        saving,

        toast,

        openNew,
        openEdit,
        closeDialog,

        save,
        remove,
        loadGroups
    };
}
