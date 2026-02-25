package datastructures

import (
	"container/heap"

	"golang.org/x/exp/constraints"
)

// minHeapSlice 是底层切片，实现 heap.Interface
type minHeapSlice[T constraints.Ordered] []T

func (h minHeapSlice[T]) Len() int {
	return len(h)
}

func (h minHeapSlice[T]) Less(i, j int) bool {
	return h[i] < h[j]
}

func (h minHeapSlice[T]) Swap(i, j int) {
	h[i], h[j] = h[j], h[i]
}

func (h *minHeapSlice[T]) Push(x any) {
	*h = append(*h, x.(T))
}

func (h *minHeapSlice[T]) Pop() any {
	old := *h
	n := len(old)
	x := old[n-1]
	*h = old[0 : n-1]
	return x
}

// MinHeap 最小堆，支持所有 Ordered 类型（包括所有 comparable 的数字和字符串类型）
type MinHeap[T constraints.Ordered] struct {
	data *minHeapSlice[T]
}

// NewMinHeap 创建一个新的最小堆
func NewMinHeap[T constraints.Ordered]() *MinHeap[T] {
	h := &minHeapSlice[T]{}
	heap.Init(h)
	return &MinHeap[T]{
		data: h,
	}
}

// Push 向堆中添加元素
func (mh *MinHeap[T]) Push(value T) {
	heap.Push(mh.data, value)
}

// Pop 移除并返回堆顶元素（最小值）
func (mh *MinHeap[T]) Pop() T {
	return heap.Pop(mh.data).(T)
}

// Peek 查看堆顶元素但不移除
func (mh *MinHeap[T]) Peek() T {
	return (*mh.data)[0]
}

// Size 返回堆中元素个数
func (mh *MinHeap[T]) Size() int {
	return mh.data.Len()
}

// IsEmpty 判断堆是否为空
func (mh *MinHeap[T]) IsEmpty() bool {
	return mh.data.Len() == 0
}
