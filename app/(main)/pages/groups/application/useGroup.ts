'use client';

import { useCallback, useEffect, useState } from 'react';

import { Group, createEmptyGroup } from '../domain/group';
import { groupService } from './group.service';

export function useGroup() {
    const [groups, setGroups] = useState<Group[]>([]);
    const [selectedGroup, setSelectedGroup] = useState<Group>(createEmptyGroup());

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
            throw error;
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

            closeDialog();
            await loadGroups();
        } catch (error) {
            console.error('Erro ao salvar grupo:', error);
            throw error;
        } finally {
            setSaving(false);
        }
    };

    const remove = async (group: Group) => {
        if (!group.id) {
            throw new Error('Não foi possível excluir: grupo sem identificador');
        }

        try {
            setLoading(true);

            await groupService.remove(group.id);
            await loadGroups();
        } catch (error) {
            console.error('Erro ao excluir grupo:', error);
            throw error;
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
        openNew,
        openEdit,
        closeDialog,
        save,
        remove,
        loadGroups
    };
}
