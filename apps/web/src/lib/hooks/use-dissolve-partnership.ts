import { useMutation, useQueryClient } from '@tanstack/react-query'
import { db } from '@/lib/db'
import { queryKeys } from './query-keys'

export function useDissolvePartnership() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id }: { id: string; userIds: [string, string] }) =>
      db.dissolvePartnership(id),
    onSuccess: (_result, vars) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.partnerships.detail(vars.id) })
      for (const uid of vars.userIds) {
        queryClient.invalidateQueries({ queryKey: queryKeys.users.detail(uid) })
      }
    },
  })
}
